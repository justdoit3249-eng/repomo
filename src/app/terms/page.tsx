import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | Repomo",
  description: "Repomoの利用規約",
};

const sections = [
  {
    title: "1. 適用",
    body: "本規約は、Repomoが提供するAIコンテンツ変換サービスの利用条件を定めるものです。ユーザーは、本サービスを利用することで本規約に同意したものとみなされます。",
  },
  {
    title: "2. アカウント",
    body: "ユーザーは、正確な情報を用いてアカウントを作成し、自己の責任でアカウントを管理するものとします。アカウントの不正利用を確認した場合は、速やかに運営者へ連絡してください。",
  },
  {
    title: "3. 禁止事項",
    body: "ユーザーは、法令または公序良俗に反する行為、第三者の権利を侵害する行為、不正アクセス、過度な負荷をかける行為、虚偽情報の入力、その他運営者が不適切と判断する行為を行ってはなりません。",
  },
  {
    title: "4. 生成コンテンツ",
    body: "ユーザーが入力した情報および生成されたコンテンツの利用責任はユーザーにあります。生成結果の正確性、完全性、適法性、特定目的への適合性は保証されません。公開前に必ずユーザー自身で確認してください。",
  },
  {
    title: "5. 課金",
    body: "有料プランの決済はStripeを通じて行われます。料金、請求周期、解約条件は料金ページまたは決済画面に表示される内容に従います。法令上必要な場合を除き、支払い済み料金の返金は行いません。",
  },
  {
    title: "6. サービスの変更・停止",
    body: "運営者は、必要に応じて本サービスの内容を変更、中断、停止または終了できます。これによりユーザーに損害が発生した場合でも、運営者は法令で認められる範囲で責任を負いません。",
  },
  {
    title: "7. 免責",
    body: "本サービスは現状有姿で提供されます。運営者は、本サービスに障害や不具合がないこと、生成結果がユーザーの期待を満たすことを保証しません。",
  },
  {
    title: "8. 規約の変更",
    body: "運営者は、必要に応じて本規約を変更できます。変更後にユーザーが本サービスを利用した場合、変更後の規約に同意したものとみなされます。",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <a href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Repomo
        </a>
        <h1 className="mt-6 text-4xl font-bold text-gray-950">利用規約</h1>
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
