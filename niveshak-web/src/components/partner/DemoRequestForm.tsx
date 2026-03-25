import { useState } from 'react';
import { Button } from '@components/common/Button';
import { useTranslation } from '@hooks/useTranslation';
import { submitDemoLead } from '@lib/supabase';

interface FormState {
  orgName: string; contactName: string; productType: string; phoneEmail: string;
}

export function DemoRequestForm() {
  const { t } = useTranslation();
  const [form, setForm]           = useState<FormState>({ orgName: '', contactName: '', productType: '', phoneEmail: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const productOptions = [
    { value: 'bankScheme', label: t('partner.form.productOptions.bankScheme') },
    { value: 'mutualFund', label: t('partner.form.productOptions.mutualFund') },
    { value: 'platform',   label: t('partner.form.productOptions.platform') },
    { value: 'insurance',  label: t('partner.form.productOptions.insurance') },
    { value: 'govtScheme', label: t('partner.form.productOptions.govtScheme') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orgName || !form.contactName || !form.productType || !form.phoneEmail) {
      setError(t('partner.form.errorMessage'));
      return;
    }
    setError('');
    setLoading(true);
    const { ok, error: submitError } = await submitDemoLead({
      org_name: form.orgName, contact_name: form.contactName,
      product_type: form.productType, phone_email: form.phoneEmail,
    });
    setLoading(false);
    if (!ok) { setError(submitError ?? t('errors.genericError')); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-accent-pale border border-accent/30 rounded-lg p-6 text-center">
        <p className="text-accent font-sora font-bold text-2xl mb-2">{'\u2713'}</p>
        <p className="text-content font-sora font-semibold text-sm">
          {t('partner.form.successMessage')}
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full bg-input border border-line rounded-md px-3 py-2.5 text-content font-sora text-sm placeholder:text-hint outline-none focus:border-accent/60 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-[10px] font-semibold text-accent uppercase tracking-widest">
        {t('partner.form.label')}
      </p>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-sub font-sora">{t('partner.form.orgName')}</label>
          <input type="text" placeholder={t('partner.form.orgPlaceholder')} value={form.orgName}
            onChange={e => setForm(f => ({ ...f, orgName: e.target.value }))} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-sub font-sora">{t('partner.form.contactName')}</label>
          <input type="text" placeholder={t('partner.form.contactPlaceholder')} value={form.contactName}
            onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-sub font-sora">{t('partner.form.productType')}</label>
          <select value={form.productType} onChange={e => setForm(f => ({ ...f, productType: e.target.value }))} className={inputClass}>
            <option value="" disabled>Select product type</option>
            {productOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-sub font-sora">{t('partner.form.phoneEmail')}</label>
          <input type="text" placeholder={t('partner.form.phonePlaceholder')} value={form.phoneEmail}
            onChange={e => setForm(f => ({ ...f, phoneEmail: e.target.value }))} className={inputClass} />
        </div>
      </div>
      {error && <p className="text-error text-xs font-sora">{error}</p>}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Submitting\u2026' : t('partner.form.submit')}
      </Button>
    </form>
  );
}