import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props  { children: ReactNode; }
interface State  { hasError: boolean; message: string; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8 gap-6 text-center">
          <div className="w-12 h-12 bg-lime rounded-sm flex items-center justify-center">
            <span className="font-sora font-extrabold text-black text-lg">!</span>
          </div>
          <div>
            <h2 className="font-sora font-bold text-white text-lg mb-2">
              Something went wrong
            </h2>
            <p className="text-grey-mid text-sm">{this.state.message}</p>
          </div>
          <button
            onClick={() => window.location.assign('/')}
            className="bg-lime text-black font-sora font-semibold px-6 py-3 rounded-md text-sm"
          >
            Go back home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
