# Game

## Description

横スクロールのシューティングゲームです。  
純粋にJavascript+CANVASで実装しています。 

以下のステージを楽しめます。
<ol>
<li>モアイステージ（縦スクロール付）</li>
<li>火山ステージ</li>
<li>キューブスピードステージ</li>
<li>クリスタルステージ</li>
<li>フレームステージ</li>
<li>細胞ステージ</li>
<li>デバッグ用ステージ</li>
</ol>
 
対応端末
<ul>
 <li>PC（Chrome、Safari最新版）</li>
 <li>iPhone,iPad（Safari：iOS11以上、CPU：A9以降推奨）</li>
</ul>
iOSでは、Safariから「ホーム画面に書き出し」でホーム画面にアイコンを作り、そこからゲームします。  
直接Safariでゲームをすると、アドレスバー等で表示が隠れてしまいます。

操作説明 
- [A]→ショット＋ミサイル（連射付き）
- [B]→装備
- [P]→一時停止
- [S]→ステージ選択に戻る
- [R]→再度やり直し  
 

パワーアップ  
<table border="1" class="wikitable" style="text-align: center">
<tbody><tr>
<th>自機</th>
<th>イメージカラー</th>
<th>SPEED UP</th>
<th>MISSILE</th>
<th>DOUBLE</th>
<th>LASER</th>
<th>OPTION</th>
<th>&nbsp;?</th>
</tr>
<tr>
<td>タイプ1</td>
<td>青</td>
<td rowspan="4">スピードアップ</td>
<td>ミサイル</td>
<td>ダブル</td>
<td rowspan="2">レーザー</td>
<td rowspan="4">オプション</td>
<td rowspan="4">&nbsp;?（シールド）</td>
</tr>
<tr>
<td>タイプ2</td>
<td>橙</td>
<td>スプレッドボム</td>
<td>テイルガン</td>
</tr>
<tr>
<td>タイプ3</td>
<td>青</td>
<td>フォトントゥーピド</td>
<td>ダブル</td>
<td rowspan="2">リップル<span class="nowrap">レーザー</span></td>
</tr>
<tr>
<td>タイプ4</td>
<td>橙</td>
<td>2-WAYミサイル</td>
<td>テイルガン</td>
</tr>
</tbody></table>
  
ほぼほぼグラディウス2を踏襲しているので、詳細は以下ウィキペディアを参照
https://ja.wikipedia.org/wiki/%E3%82%B0%E3%83%A9%E3%83%87%E3%82%A3%E3%82%A6%E3%82%B9II_-GOFER%E3%81%AE%E9%87%8E%E6%9C%9B-#パワーアップ
  
  
## Demo
<p>実際にプレイしたゲームは、YouTubeのプレイリストとして集めております。→<a href="https://youtu.be/MxeTU1rs_-0" target="_blank"><img src="https://user-images.githubusercontent.com/12569855/40031586-543899bc-582b-11e8-8992-9092bbfd0d72.png" width="50"></a></p>
<ol>
<li>モアイステージ(パワーアップ：タイプ1 iPhone 8Plus iOS11)
<a href="https://youtu.be/GmzuXUYOeDg" target="_blank"><img src="https://user-images.githubusercontent.com/12569855/40031586-543899bc-582b-11e8-8992-9092bbfd0d72.png" width="50"></a><br>
<img src="https://user-images.githubusercontent.com/12569855/33947901-eed3961a-e068-11e7-98f4-6e28d981f127.GIF">
</li>
<li>火山ステージ(パワーアップ：タイプ4 iPhone 8Plus iOS11)
<a href="https://youtu.be/ue8ZaanUF-c" target="_blank"><img src="https://user-images.githubusercontent.com/12569855/40031586-543899bc-582b-11e8-8992-9092bbfd0d72.png" width="50"></a><br>
<img src="https://user-images.githubusercontent.com/12569855/34076655-fc95668c-e330-11e7-991e-6054252f210c.GIF">
</li>
<li>キューブスピードステージ(パワーアップ：タイプ2  iPhone 8Plus iOS11) 
<a href="https://youtu.be/qIet_lEy-wQ" target="_blank"><img src="https://user-images.githubusercontent.com/12569855/40031586-543899bc-582b-11e8-8992-9092bbfd0d72.png" width="50"></a><br>
<img src="https://user-images.githubusercontent.com/12569855/37718128-58fe5892-2d65-11e8-8dfb-1144e9f7af9f.GIF">
</li>
<li>クリスタルステージ(パワーアップ：タイプ3  iPhone 8Plus iOS11)
<a href="https://youtu.be/ITnsP8u_EQM" target="_blank"><img src="https://user-images.githubusercontent.com/12569855/40031586-543899bc-582b-11e8-8992-9092bbfd0d72.png" width="50"></a><br>
<img src="https://user-images.githubusercontent.com/12569855/33915058-994c9b94-dfe4-11e7-83c7-d65bc5240852.GIF">
</li>
<li>フレームステージ：タイプ1  iPhone 8Plus iOS11)  
<a href="https://youtu.be/bq4RG3lqMiM" target="_blank"><img src="https://user-images.githubusercontent.com/12569855/40031586-543899bc-582b-11e8-8992-9092bbfd0d72.png" width="50"></a><br>
<img src="https://user-images.githubusercontent.com/12569855/37473155-0904d3ce-28b1-11e8-8da4-6eec098959b3.GIF">
</li>
<li>細胞ステージ：タイプ4  iPhone 8Plus iOS11)  
<a href="https://youtu.be/XYH2CHFQaSI" target="_blank"><img src="https://user-images.githubusercontent.com/12569855/40031586-543899bc-582b-11e8-8992-9092bbfd0d72.png" width="50"></a><br>
<img src="https://user-images.githubusercontent.com/12569855/40211831-c59fabe6-5a87-11e8-9ed6-8f6ae8b58602.GIF">
</li>
</ol>
  
## Getting Started
ソースダウンロード後、/dist/gradius.htmlでゲームできます。  
Access URL (e.x below)  
http://hosts/dist/gradius.html  
  
<img src="https://user-images.githubusercontent.com/12569855/40169493-144017ea-5a01-11e8-9b75-7b00ca869b53.png">

## Author

[@ma_taka](https://twitter.com/ma_taka)
