export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Repomo
        </h1>
        <div className="flex items-center gap-4">
          <a href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            料金プラン
          </a>
          <a
            href="/login"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            無料で始める
          </a>
        </div>
      </header>

      <main>
        {/* Hero — EMOTION: 痛みに刺す */}
        <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          <p className="text-lg text-gray-600 mb-6">
            YouTubeを撮った。noteも書きたい。Xも投稿したい。Instagramも…
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            「全部やらなきゃ」に<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              もう疲れていませんか？
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            動画1本作るのに3時間。そこからSNS投稿を書くのにさらに2時間。<br />
            コンテンツは資産なのに、届ける作業で消耗している。
          </p>
        </section>

        {/* SOLUTION: 解決策 */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-block mb-6 px-4 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
              日本語特化 AI コンテンツ変換ツール
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              1つ入れたら、全部出てくる。
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              YouTube URL を貼るだけ。30秒後には X・Instagram・note・ブログ用の投稿が完成しています。
            </p>
            <a
              href="/login"
              className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-200"
            >
              30秒で体験してみる
            </a>
            <p className="mt-4 text-sm text-gray-600">
              Googleアカウントで即開始 / クレジットカード不要
            </p>
          </div>
        </section>

        {/* TRUST: 具体的な価値 */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            あなたの時間を取り戻す
          </h3>
          <p className="text-center text-gray-600 mb-12">
            週10時間のSNS作業が、週30分に。浮いた時間で次のコンテンツを作ろう。
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
              <div className="text-4xl font-bold text-indigo-600 mb-2">30秒</div>
              <p className="text-gray-600">YouTube URL → 全SNS投稿が完成</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
              <div className="text-4xl font-bold text-purple-600 mb-2">4媒体</div>
              <p className="text-gray-600">X・Instagram・note・ブログに一括対応</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
              <div className="text-4xl font-bold text-emerald-600 mb-2">自然な日本語</div>
              <p className="text-gray-600">海外ツールにはない、ネイティブ品質</p>
            </div>
          </div>
        </section>

        {/* HOW: 使い方 */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              3ステップで完了
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-600">
                  1
                </div>
                <h4 className="text-lg font-semibold mb-2">URLを貼る</h4>
                <p className="text-gray-600">
                  YouTube URLを貼るか、テキストをそのまま入力。
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-purple-600">
                  2
                </div>
                <h4 className="text-lg font-semibold mb-2">出力先を選ぶ</h4>
                <p className="text-gray-600">
                  X、Instagram、note、ブログから選択。複数同時もOK。
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-emerald-600">
                  3
                </div>
                <h4 className="text-lg font-semibold mb-2">コピーして投稿</h4>
                <p className="text-gray-600">
                  AIが生成した投稿をコピー。あとは貼るだけ。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LOGIC: こんな人に最適 */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            こんな悩みを解決します
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100">
              <span className="text-2xl">😫</span>
              <div>
                <h4 className="font-semibold mb-1">「SNS投稿が面倒で続かない」</h4>
                <p className="text-gray-600 text-sm">URLを貼るだけ。書く作業そのものがなくなります。</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100">
              <span className="text-2xl">😫</span>
              <div>
                <h4 className="font-semibold mb-1">「各SNSでの書き分けが大変」</h4>
                <p className="text-gray-600 text-sm">Xは短く刺さる文、noteは長文構成。自動で使い分けます。</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100">
              <span className="text-2xl">😫</span>
              <div>
                <h4 className="font-semibold mb-1">「動画は作れるけど文章は苦手」</h4>
                <p className="text-gray-600 text-sm">動画の内容をAIが理解し、あなたの言葉で文章化します。</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100">
              <span className="text-2xl">😫</span>
              <div>
                <h4 className="font-semibold mb-1">「海外AIツールは日本語が微妙」</h4>
                <p className="text-gray-600 text-sm">日本語特化設計。バズる日本語表現をAIが生成します。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">シンプルな料金</h3>
            <p className="text-gray-600 mb-10">まずは無料で体験。気に入ったら月額プランで無制限に。</p>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h4 className="font-semibold text-lg">Free</h4>
                <p className="text-3xl font-bold mt-2">¥0</p>
                <p className="text-gray-500 text-sm mt-1">月5回まで</p>
              </div>
              <div className="p-6 bg-white border-2 border-indigo-500 rounded-xl relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-500 text-white text-xs font-medium rounded-full">
                  人気
                </div>
                <h4 className="font-semibold text-lg">Starter</h4>
                <p className="text-3xl font-bold mt-2">¥2,980</p>
                <p className="text-gray-500 text-sm mt-1">月30回</p>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h4 className="font-semibold text-lg">Pro</h4>
                <p className="text-3xl font-bold mt-2">¥9,800</p>
                <p className="text-gray-500 text-sm mt-1">無制限</p>
              </div>
            </div>
            <a href="/pricing" className="inline-block mt-8 text-indigo-600 font-medium hover:underline">
              全プランの詳細を見る →
            </a>
          </div>
        </section>

        {/* Final CTA — EMOTION + ACTION */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            もう、手動で書き直すのは終わりにしよう。
          </h3>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            あなたのコンテンツは価値がある。<br />
            その価値を、全てのSNSに届けるのはAIに任せよう。
          </p>
          <a
            href="/login"
            className="inline-block px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition"
          >
            無料で始める
          </a>
          <p className="mt-4 text-sm text-white/70">
            30秒で登録完了。いつでも解約OK。
          </p>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <div className="flex justify-center gap-4 mb-2">
          <a href="/privacy" className="hover:text-gray-700 underline">プライバシーポリシー</a>
          <a href="/terms" className="hover:text-gray-700 underline">利用規約</a>
        </div>
        <p>&copy; 2026 Repomo. All rights reserved.</p>
      </footer>
    </div>
  );
}
