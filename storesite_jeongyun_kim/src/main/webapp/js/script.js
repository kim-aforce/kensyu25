// HTMLが読み込まれたらスクリプトを実行
$(document).ready(function() {


/*============================================
								スライダー機能
============================================ */
	// スライダーを初期化
	$('.slider').slick({
		autoplay: true,
		autoplaySpeed: 3000,
		dots: true,
		arrows: true　//矢印で操作できる　　　　
	});

/*============================================
								モーダル機能
============================================ */
// モーダルを開く（カートを見るボタンをクリック）
$('#openCartModal').on('click', function(event) {
	event.preventDefault(); // リンクの動作を止める（再読み込みなど）
	$('.cart-summary').removeClass('animate-out').addClass('animate-in'); // 左から入る
	$('#cartModal').fadeIn(); // 背景表示
});

// モーダルを閉じる（×ボタンをクリック）
$('.close').on('click', function() {
	$('.cart-summary').removeClass('animate-in').addClass('animate-out'); // 右へ出る
	setTimeout(() => {
		$('#cartModal').fadeOut(); // 背景非表示
	}, 400); // アニメーション終了後に非表示
});

// モーダル外をクリックしたら閉じる
$(window).on('click', function(event) {
	if (event.target.id === 'cartModal') {
		$('.cart-summary').removeClass('animate-in').addClass('animate-out'); // 右へ出る
		setTimeout(() => {
			$('#cartModal').fadeOut(); // 背景非表示
		}, 400); // アニメーション終了後に非表示
	}
});

/*============================================
								ソート機能
============================================ */

		let cart = []; // カート配列 初期化

		const products = Array.from(document.querySelectorAll('.product'));
		const container = document.querySelector('.product-list');

		// 昇順ソートボタン
		document.getElementById('sort-asc').addEventListener('click', () => {
			const sorted = [...products].sort((a, b) => {
				const priceA = parseInt(a.querySelector('.product-price').textContent.replace(/\D/g, ''));
				const priceB = parseInt(b.querySelector('.product-price').textContent.replace(/\D/g, ''));
				return priceA - priceB;
			});
			container.innerHTML = '';
			sorted.forEach(p => container.appendChild(p));
		});

		// 降順ソートボタン
		document.getElementById('sort-desc').addEventListener('click', () => {
			const sorted = [...products].sort((a, b) => {
				const priceA = parseInt(a.querySelector('.product-price').textContent.replace(/\D/g, ''));
				const priceB = parseInt(b.querySelector('.product-price').textContent.replace(/\D/g, ''));
				return priceB - priceA;
			});
			container.innerHTML = '';
			sorted.forEach(p => container.appendChild(p));
		});

/*============================================
								カート機能
============================================ */

	// カートに追加ボタン
	document.querySelectorAll('.product button').forEach(button => { //商品にあるボタンの処理を繰り返し
		button.addEventListener('click', function() { //ボタンにイベント追加

			const product = this.closest('.product'); // このボタンが属している商品のブロック全体を取得、thisは今クリックしたボタン
			const name = product.querySelector('.product-name').textContent.trim(); //textContentで商品名をテキスト取得
			const priceText = product.querySelector('.product-price').textContent.trim(); //価格をテキスト取得記号のため
			const price = parseInt(priceText.replace(/[\u00A5,\s]/g, '')); //記号を除く、数字で変換
			const quantity = parseInt(product.querySelector('select').value); //プレスダウンで選択した数量を数字に変換

			if (quantity > 0) { //カートに追加し
				const existing = cart.find(item => item.name === name); //カートであるかないか検索します					
				if (existing) {	
					existing.quantity += quantity; //ある場合数量だけ
				} else {										
					cart.push({ name, price, quantity }); //ない場合追加
				}
				updateCartDisplay(); //カート内容更新
				alert("カートに追加しました。");
			}
		});
	});

	// カート情報を更新
	function updateCartDisplay() {
		const totalQuantity = document.getElementById('totalQuantity'); //合計点数を表示する要素
		const totalPrice = document.getElementById('totalPrice'); //合計金額を表示する要素
		const itemList = document.getElementById('cartItemList'); //カート内の商品リストを追加する

		let totalQty = 0; //数量
		let total = 0; //金額

		itemList.innerHTML = ''; //表示エリアを空にする

		cart.forEach(item => { //cartに入れた各商品に対して繰り返し
			totalQty += item.quantity;
			total += item.price * item.quantity; //総計を計算
			const li = document.createElement('li'); //商品を表示するためのリスト要素を作成する
			li.textContent = `${item.name} × ${item.quantity}：¥${item.price * item.quantity}`; //商品名　X　数量　：　金額で表示
			itemList.appendChild(li); //作成したliをリストに追加
		});
		totalQuantity.textContent = totalQty;
		totalPrice.textContent = total; //合計点数・金額を画面に表示
	}

	// カートリセットボタン
	document.getElementById('clearCart').addEventListener('click', function() {
		cart = [];
		updateCartDisplay();
	});
});