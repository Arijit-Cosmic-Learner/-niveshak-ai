import { useState } from 'react';
import { Button } from '@components/common/Button';
import { useTranslation } from '@hooks/useTranslation';

interface FormState {
  orgName:     string;
  contactName: string;
  productType: string;
  phoneEmail:  string;
}

export function DemoRequestForm() {
  const { t } = useTranslation();
  const [form, setForm]           = useState<FormState>({
    orgName: '', contactName: '', productType: '', phoneEmail: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');

  const productOptions = [
    { value: 'bankScheme', label: t('partner.form.productOptions.bankScheme') },
    { value: 'mutualFund', label: t('partner.form.productOptions.mutualFund') },
    { value: 'platform',   label: t('partner.form.productOptions.platform') },
    { value: 'insurance',  label: t('partner.form.productOptions.insurance') },
    { value: 'govtScheme', label: t('partner.form.productOptions.govtScheme') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orgName || !form.contactName || !form.productType || !form.phoneEmail) {
      setError(t('partner.form.errorMessage'));
      return;
    }
    setError('');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-black-light border border-lime/30 rounded-lg p-6 text-center">
        <p className="text-lime font-sora font-bold text-2xl mb-2">✓</p>
        <p className="text-white font-sora font-semibold text-sm">
          {t('partner.form.successMessage')}
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full bg-black-mid border border-border-dark rounded-md px-3 py-2.5 text-white font-sora text-sm placeholder:text-grey-dark outline-none focus:border-lime/60 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-[10px] font-semibold text-lime uppercase tracking-widest">
        {t('partner.form.label')}
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-grey-mid font-sora">{t('partner.form.orgName')}</label>
          <input
            type="text"
            placeholder={t('partner.form.orgPlaceholder')}
            value={form.orgName}
            onChange={e => setForm(f => ({ ...f, orgName: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-grey-mid font-sora">{t('partner.form.contactName')}</label>
          <input
            type="text"
            placeholder={t('partner.form.contactPlaceholder')}
            value={form.contactName}
            onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-grey-mid font-sora">{t('partner.form.productType')}</label>
          <select
            value={form.productType}
            onChange={e => setForm(f => ({ ...f, productType: e.target.value }))}
            className={inputClass}
          >
            <option value="" disabled>Select product type</option>
            {productOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-grey-mid font-sora">{t('partner.form.phoneEmail')}</label>
          <input
            type="text"
            placeholder={t('partner.form.phonePlaceholder')}
            value={form.phoneEmail}
            onChange={e => setForm(f => ({ ...f, phoneEmail: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-error text-xs font-sora">{error}</p>}

      <Button type="submit" fullWidth>{t('partner.form.submit')}</Button>
    </form>
  );
}
