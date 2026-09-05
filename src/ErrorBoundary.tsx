import React, { Component } from "react";

interface State {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends (Component as any) {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught runtime error in application:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFDF5] text-slate-800 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border-2 border-black rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 border-2 border-black rounded-2xl mx-auto flex items-center justify-center text-2xl font-black">
              !
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Terjadi Kendala Memuat Halaman
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {this.state.error?.message || "Aplikasi mengalami kendala saat memuat data. Silakan muat ulang halaman."}
            </p>
            <div className="pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-[#FEF08A] hover:bg-[#FDE047] text-black font-black text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
              >
                Muat Ulang Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

