import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/useAccount";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Upload, X, FileCheck, Loader2 } from "lucide-react";

const steps = [
  { label: "Business Info" },
  { label: "Contact Details" },
  { label: "KYC Documents" },
  { label: "Agreement" },
  { label: "Submit" },
];

const DashboardCompliance = () => {
  const { data: account } = useAccount();
  const queryClient = useQueryClient();
  const idDocRef = useRef<HTMLInputElement>(null);
  const businessCertRef = useRef<HTMLInputElement>(null);

  const [directorName, setDirectorName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [kraPin, setKraPin] = useState("");
  const [expectedVolume, setExpectedVolume] = useState("");
  const [idDocumentUrl, setIdDocumentUrl] = useState<string | null>(null);
  const [businessCertUrl, setBusinessCertUrl] = useState<string | null>(null);

  const idUpload = useFileUpload({
    bucket: "kyc-documents",
    folder: account?.id || "temp",
    maxSizeMB: 5,
  });

  const certUpload = useFileUpload({
    bucket: "kyc-documents",
    folder: account?.id || "temp",
    maxSizeMB: 5,
  });

  const { data: kyc } = useQuery({
    queryKey: ["kyc", account?.id],
    enabled: !!account?.id,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("kyc_documents")
        .select("*")
        .eq("account_id", account!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (kyc) {
      setDirectorName(kyc.director_name ?? "");
      setPhone(kyc.phone ?? "");
      setAddress(kyc.address ?? "");
      setKraPin(kyc.kra_pin ?? "");
      setExpectedVolume(kyc.expected_volume ?? "");
      setIdDocumentUrl(kyc.id_document_url ?? null);
      setBusinessCertUrl(kyc.business_cert_url ?? null);
    }
  }, [kyc]);

  const handleIdDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await idUpload.upload(file);
    if (result) {
      setIdDocumentUrl(result.url);
      toast({ title: "ID Document uploaded" });
    } else if (idUpload.error) {
      toast({ title: "Upload failed", description: idUpload.error, variant: "destructive" });
    }
  };

  const handleBusinessCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await certUpload.upload(file);
    if (result) {
      setBusinessCertUrl(result.url);
      toast({ title: "Business Certificate uploaded" });
    } else if (certUpload.error) {
      toast({ title: "Upload failed", description: certUpload.error, variant: "destructive" });
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (asDraft: boolean) => {
      const payload = {
        account_id: account!.id,
        director_name: directorName,
        phone,
        address,
        kra_pin: kraPin,
        expected_volume: expectedVolume,
        id_document_url: idDocumentUrl,
        business_cert_url: businessCertUrl,
        status: asDraft ? ("DRAFT" as const) : ("PENDING" as const),
      };
      if (kyc?.id) {
        const { error } = await (supabase as any).from("kyc_documents").update(payload).eq("id", kyc.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("kyc_documents").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: (_, asDraft) => {
      toast({ title: asDraft ? "Draft saved" : "Compliance submitted for review" });
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const currentStep = !kyc ? 0 : kyc.status === "DRAFT" ? 1 : kyc.status === "PENDING" ? 3 : kyc.status === "APPROVED" ? 4 : 1;

  return (
    <div>
      {/* Warning Banner */}
      {(!kyc || kyc.status === "DRAFT") && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-[10px] px-4 py-3 mb-5 flex items-center justify-between">
          <span className="text-xs text-yellow-400">
            ⚠️ Complete compliance to unlock LIVE mode and start accepting real payments.
          </span>
          <Button size="sm" className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-xs">
            Go Live →
          </Button>
        </div>
      )}
      {kyc?.status === "PENDING" && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-[10px] px-4 py-3 mb-5">
          <span className="text-xs text-blue-400">🕐 Your KYC is under review. We'll notify you within 2 business days.</span>
        </div>
      )}
      {kyc?.status === "APPROVED" && (
        <div className="bg-primary/10 border border-primary/30 rounded-[10px] px-4 py-3 mb-5">
          <span className="text-xs text-primary">✅ KYC Approved! Your account is fully verified and live.</span>
        </div>
      )}
      {kyc?.status === "REJECTED" && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-[10px] px-4 py-3 mb-5">
          <span className="text-xs text-red-400">❌ KYC Rejected: {kyc.rejection_reason || "Please contact support."}</span>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center gap-0 mb-6">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="text-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                i < currentStep ? "bg-primary text-primary-foreground"
                  : i === currentStep ? "bg-purple-600 text-white"
                  : "bg-white/10 text-white/30"
              }`}>
                {i < currentStep ? "✓" : i + 1}
              </div>
              <div className="text-[9px] text-white/30 mt-1 whitespace-nowrap">{step.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${i < currentStep ? "bg-primary" : "bg-white/[0.08]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] font-semibold text-white/50 mb-1.5 block">Director Full Name</Label>
              <Input value={directorName} onChange={(e) => setDirectorName(e.target.value)} placeholder="James Mwangi" className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg" />
            </div>
            <div>
              <Label className="text-[11px] font-semibold text-white/50 mb-1.5 block">Phone Number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 712 345 678" className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg" />
            </div>
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-white/50 mb-1.5 block">Physical Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Westlands, Nairobi, Kenya" className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg" />
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-white/50 mb-1.5 block">KRA PIN</Label>
            <Input value={kraPin} onChange={(e) => setKraPin(e.target.value)} placeholder="A012345678B" className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg" />
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-white/50 mb-1.5 block">Expected Monthly Volume</Label>
            <Input value={expectedVolume} onChange={(e) => setExpectedVolume(e.target.value)} placeholder="KSh 500K – 1M" className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg" />
          </div>
        </div>

        <div className="space-y-3">
          {/* ID Document Upload */}
          <div
            className={`border-2 border-dashed rounded-[10px] p-5 text-center text-white/30 text-xs transition-colors cursor-pointer hover:border-white/20 ${
              idDocumentUrl ? "border-primary/40 bg-primary/5" : "border-white/10"
            }`}
            onClick={() => !idUpload.uploading && idDocRef.current?.click()}
          >
            <input
              ref={idDocRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleIdDocUpload}
              className="hidden"
            />
            <div className="text-2xl mb-2">{idDocumentUrl ? "✅" : "🪪"}</div>
            <div className="font-semibold text-white/50 mb-1">National ID / Passport</div>
            <div>Drag and drop or click to upload (JPG, PNG, PDF — Max 5MB)</div>
            {idUpload.uploading ? (
              <div className="mt-2 flex items-center justify-center gap-2 text-primary text-[11px]">
                <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
              </div>
            ) : idDocumentUrl ? (
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-primary text-[11px] flex items-center gap-1">
                  <FileCheck className="w-3 h-3" /> Document uploaded
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdDocumentUrl(null);
                  }}
                  className="text-red-400/70 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="mt-2.5 text-[11px] border-white/15 text-white/70 bg-transparent">
                <Upload className="w-3 h-3 mr-1.5" /> Choose File
              </Button>
            )}
          </div>

          {/* Business Certificate Upload */}
          <div
            className={`border-2 border-dashed rounded-[10px] p-5 text-center text-white/30 text-xs transition-colors cursor-pointer hover:border-white/20 ${
              businessCertUrl ? "border-primary/40 bg-primary/5" : "border-white/10"
            }`}
            onClick={() => !certUpload.uploading && businessCertRef.current?.click()}
          >
            <input
              ref={businessCertRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleBusinessCertUpload}
              className="hidden"
            />
            <div className="text-2xl mb-2">{businessCertUrl ? "✅" : "📑"}</div>
            <div className="font-semibold text-white/50 mb-1">Business Registration Certificate</div>
            <div>Certificate of Incorporation or Business Name</div>
            {certUpload.uploading ? (
              <div className="mt-2 flex items-center justify-center gap-2 text-primary text-[11px]">
                <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
              </div>
            ) : businessCertUrl ? (
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-primary text-[11px] flex items-center gap-1">
                  <FileCheck className="w-3 h-3" /> Document uploaded
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBusinessCertUrl(null);
                  }}
                  className="text-red-400/70 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="mt-2.5 text-[11px] border-white/15 text-white/70 bg-transparent">
                <Upload className="w-3 h-3 mr-1.5" /> Choose File
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2.5 mt-5">
        <Button
          onClick={() => saveMutation.mutate(false)}
          disabled={saveMutation.isPending || kyc?.status === "APPROVED" || kyc?.status === "PENDING"}
          className="bg-purple-600 text-white text-xs"
        >
          {saveMutation.isPending ? "Saving..." : "Save & Continue →"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => saveMutation.mutate(true)}
          disabled={saveMutation.isPending || kyc?.status === "APPROVED" || kyc?.status === "PENDING"}
          className="text-white/60 text-xs bg-white/[0.05]"
        >
          Save Draft
        </Button>
      </div>
    </div>
  );
};

export default DashboardCompliance;
