import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Repomo",
  description: "Repomoのプライバシーポリシー",
};

const sections = [
  {
    title: "1. 取得する情報",
    body: "当サービスは、ログイン時に提供されるメールアドレス、氏名、プロフィール画像、入力されたYouTube URLまたはテキスト、生成結果、利用回数、決済管理に必要なStripeの顧客IDおよびサブスクリプションIDを取得します。",
  },
  {
    title: "2. 利用目的",
    body: "取得した情報は、アカウント管理、コンテンツ生成、利用上限の管理、課金・決済処理、不正利用の防止、サービス改善、お問い合わせ対応のために利用します。",
  },
  {
    title: "3. 外部サービスの利用",
    body: "当サービスは、認証、データ保存、AI生成、決済、YouTube動画情報の取得のために、Google、Supabase、Google Gemini、Stripe、YouTube Data API等の外部サービスを利用します。これらのサービスには、処理に必要な範囲で情報が送信されます。",
  },
  {
    title: "4. 第三者提供",
    body: "法令に基づく場合または本人の同意がある場合を除き、取得した個人情報を第三者に提供しません。ただし、前項の外部サービス利用は第三者提供に該当しない委託または利用環境として扱います。",
  },
  {
    title: "5. 保存期間",
    body: "取得した情報は、利用目的の達成に必要な期間保存します。アカウント削除や削除依頼があった場合、法令上または運用上必要な情報を除き、合理的な期間内に削除します。",
  },
  {
    title: "6. 安全管理",
    body: "当サービスは、アクセス制御、認証情報の適切な管理、通信の暗号化など、個人情報の漏えい、滅失、毀損を防止するために合理的な安全管理措置を講じます。",
  },
  {
    title: "7. 開示・訂正・削除",
    body: "ユーザーは、自己の個人情報について、開示、訂正、利用停止、削除を求めることができます。お問い合わせ窓口にご連絡ください。",
  },
  {
    title: "8. 改定",
    body: "当サービスは、必要に応じて本ポリシーを変更できます。重要な変更がある場合は、サービス上で告知します。",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <a href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Repomo
        </a>
        <h1 className="mt-6 text-4xl font-bold text-gray-950">プライバシーポリシー</h1>
        <p className="mt-4 text-sm text-gray-500">制定日: 2026年5月17日</p>
        <div className="mt-10 space-y-8 text-gray-700">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-gray-950">{section.title}</h2>
              <p className="mt-3 leading-8">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
