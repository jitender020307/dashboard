import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Forensic Core ErrorBoundary caught an exception:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-mono text-xs">
          <div className="max-w-md w-full bg-white border border-slate-300 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <h1 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  SYSTEM RECOVERY INTERCEPT
                </h1>
                <p className="text-[11px] text-slate-500">
                  Enclave runtime exception safely caught
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 break-words font-mono text-[11px]">
              {this.state.error?.message || 'An unexpected runtime error occurred.'}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>REINITIALIZE SCIF WORKSPACE</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
