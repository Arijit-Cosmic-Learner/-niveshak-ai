import { useNavigate } from 'react-router-dom';
import { LogoMark } from '@components/common/LogoMark';
import { Button } from '@components/common/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-120px)] gap-6 px-8 text-center">
      <LogoMark size="lg" />
      <div>
        <p className="font-sora font-extrabold text-accent text-6xl mb-2">404</p>
        <h2 className="font-sora font-bold text-content text-xl mb-2">Page not found</h2>
        <p className="text-sub text-sm">
          This page doesn't exist. Let's get you back on track.
        </p>
      </div>
      <Button onClick={() => navigate('/')}>Go to Home</Button>
    </div>
  );
}