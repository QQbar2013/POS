$(document).ready(function(){
  
  $('#totalQtyInput').on('keyup click change input', function(){
    var unitPrice = 15;
    var totalQty = parseInt($(this).val());
    var $hintText = $('#hintText');
    
    if (isNaN(totalQty) || totalQty <= 0) {
      resetDisplay();
      return;
    }
    
    // 您的核心精密公式
    // 1. 購買 = ROUNDUP(總數 / 1.1, 0)
    var paidQty = Math.ceil(totalQty / 1.1);
    
    // 2. 贈送 = ROUNDDOWN(購買 / 10, 0)
    var freeQty = Math.floor(paidQty / 10);
    
    // 3. 應有總數 = 購買 + 贈送
    var logicTotal = paidQty + freeQty;
    
    // 4. 計算差距 X
    var diffX = logicTotal - totalQty;
    
    if (diffX !== 0) {
      // 邏輯不符，顯示「請再選 X 枝」
      $('#resultArea').hide();
      $hintText.text('💡 請再選 ' + diffX + ' 枝');
      $('#hintArea').show();
    } else {
      // 邏輯相符，顯示結帳資訊
      $('#hintArea').hide();
      $('#resultArea').show();
      
      var finalAmount = paidQty * unitPrice;

      $('#displayTotal').text(totalQty);
      $('#promoText').text('買 ' + paidQty + ' 送 ' + freeQty);
      $('#calcPaid').text(paidQty);
      $('#finalTotal').text(finalAmount);
    }
  });

  $('#resetBtn').on('click', function(){
    $('#totalQtyInput').val('');
    resetDisplay();
    $('#totalQtyInput').focus();
  });

  function resetDisplay() {
    $('#hintArea').hide();
    $('#resultArea').show();
    $('#displayTotal').text('0');
    $('#promoText').text('買 0 送 0');
    $('#calcPaid').text('0');
    $('#finalTotal').text('0');
  }
});