"use client";

import { useState } from "react";
import type { PaidPlan } from "@/lib/plans";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(plan: PaidPlan) {
    setLoadingPlan(plan);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout session could not be created");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoadingPlan(null);
    }
  }

  const plans = [
    {
      name: "Free",
      price: "¥0",
      period: "",
      description: "まずは試してみたい方に",
      features: ["月3回まで変換", "全プラットフォーム対応", "3トーン選択"],
      cta: "無料で始める",
      action: () => { window.location.href = "/login"; },
      highlighted: false,
      planKey: null as PaidPlan | null,
    },
    {
      name: "Starter",
      price: "¥2,980",
      period: "/月",
      description: "個人クリエイター向け",
      features: ["月30回まで変換", "全プラットフォーム対応", "3トーン選択", "履歴保存（無制限）", "優先サポート"],
      cta: "Starterを始める",
      action: () => startCheckout("STARTER"),
      highlighted: true,
      planKey: "STARTER" as PaidPlan,
    },
    {
      name: "Pro",
      price: "¥9,800",
      period: "/月",
      description: "本格運用したい方に",
      features: ["無制限変換", "全プラットフォーム対応", "3トーン選択", "履歴保存（無制限）", "優先サポート", "API アクセス", "カスタムプロンプト"],
      cta: "Proを始める",
      action: () => startCheckout("PRO"),
      highlighted: false,
      planKey: "PRO" as PaidPlan,
    },
    {
      name: "Business",
      price: "¥29,800",
      period: "/月",
      description: "チーム・企業向け",
      features: ["無制限変換", "全プラットフォーム対応", "チームメンバー5名まで", "ブランドテンプレート", "分析ダッシュボード", "専任サポート", "請求書払い対応"],
      cta: "Businessを始める",
      action: () => startCheckout("BUSINESS"),
      highlighted: false,
      planKey: "BUSINESS" as PaidPlan,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Repomo
        </a>
        <a href="/login" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
          ログイン
        </a>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">料金プラン</h1>
          <p className="text-lg text-gray-600">あなたの発信スタイルに合ったプランを選んでください。</p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-xl flex flex-col ${
                plan.highlighted
                  ? "border-2 border-indigo-500 shadow-lg relative"
                  : "border border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-500 text-white text-xs font-medium rounded-full">
                  おすすめ
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-3 mb-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-indigo-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={plan.action}
                disabled={loadingPlan !== null}
                className={`block w-full text-center py-3 rounded-lg font-medium transition ${
                  plan.highlighted
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                }`}
              >
                {loadingPlan === plan.planKey ? "処理中..." : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">よくある質問</h3>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">無料プランに制限はありますか？</h4>
              <p className="mt-1 text-sm text-gray-600">月3回までの変換が可能です。全プラットフォーム・全トーンが利用できます。</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">いつでも解約できますか？</h4>
              <p className="mt-1 text-sm text-gray-600">はい。いつでもワンクリックで解約可能です。日割り返金はありませんが、期間終了まで利用できます。</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">生成されたコンテンツの著作権は？</h4>
              <p className="mt-1 text-sm text-gray-600">生成されたコンテンツの著作権はすべてお客様に帰属します。商用利用も自由です。</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
