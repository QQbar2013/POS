var products = {
  list : {
    1 : { name:"多多", price: 12 },
    2 : { name:"葡萄", price: 12 },
    3 : { name:"荔枝", price: 12 },
    4 : { name:"百香果", price: 12 },
    5 : { name:"草莓", price: 12 },
    6 : { name:"蘋果", price: 15 },
    7 : { name:"鳳梨", price: 15 },
    8 : { name:"柳橙", price: 15 },
    9 : { name:"水蜜桃", price: 15 },
    10 : { name:"芒果", price: 15 },
    11 : { name:"樂華限定", price: 15 },
    13 : { name:"重新計算", price: 0 }
  },

  draw : () => {
    const wrapper = document.getElementById("poslist");
    wrapper.innerHTML = "";
    for (let pid in products.list) {
      let p = products.list[pid],
          pdt = document.createElement("div");
      pdt.className = "pwrap";
      pdt.onclick = () => { cart.add(pid); };
      pdt.innerHTML = `<span class="pname">${p.name}</span><span class="pprice">$${p.price}</span>`;
      wrapper.appendChild(pdt);
    }
  }
};

var cart = {
  items : [],

  save : () => { localStorage.setItem("cart_v3", JSON.stringify(cart.items)); },
  load : () => { cart.items = JSON.parse(localStorage.getItem("cart_v3") || "[]"); },
  
  // 移除詢問，點擊直接清空
  nuke : () => { 
    cart.items = []; 
    cart.save(); 
    cart.list(); 
  },

  init : () => { cart.load(); products.draw(); cart.list(); },

  reorganize : () => {
    let summary = cart.items.reduce((acc, curr) => {
      let exist = acc.find(item => item.pid === curr.pid);
      if (exist) { exist.qty += curr.qty; } 
      else { acc.push({ pid: curr.pid, qty: curr.qty }); }
      return acc;
    }, []);
    summary.sort((a, b) => parseInt(a.pid) - parseInt(b.pid));
    cart.items = summary;
    cart.save();
    cart.list();
  },

  list : () => {
    const cartWrap = document.getElementById("poscart");
    const totalWrap = document.getElementById("postotal");
    let total = 0, totalQty = 0;
    
    cartWrap.innerHTML = "";
    
    cart.items.forEach((item, idx) => {
      let pdt = products.list[item.pid];
      let div = document.createElement("div");
      div.className = "citem";
      div.innerHTML = `
        <span class="cname">${pdt.name}</span>
        <input type="button" value="X" class="cdel" onclick="cart.remove(${idx})">
        <div style="width:100%; margin-top:3px;">
          <input type="button" value="-" class="cqty-sub" onclick="cart.change(${idx}, ${item.qty - 1})">
          <input type="number" value="${item.qty}" class="cqty-input" onchange="cart.change(${idx}, parseInt(this.value))">
          <input type="button" value="+" class="cqty-add" onclick="cart.change(${idx}, ${item.qty + 1})">
        </div>
      `;
      cartWrap.appendChild(div);
      totalQty += item.qty;
      total += item.qty * pdt.price;
    });

    total -= 12 * Math.floor(totalQty / 11);

    let promoHint = "";
    let remainder = totalQty % 11;
    if (remainder === 10) {
      promoHint = `<div class="promo-hint">✨ 再選 1 枝！(免費)</div>`;
    } else if (remainder === 9) {
      promoHint = `<div class="promo-hint">✨ 再選 2 枝送 1 枝</div>`;
    }

    totalWrap.innerHTML = `
      ${promoHint}
      <h2>總數</h2><span class="big-num">${totalQty}</span>
      <h2>金額</h2><span class="big-num">$${total}</span>
      <input type="button" value="清空全部" id="cempty" onclick="cart.nuke()">
    `;
  },

  add : (pid) => {
    if (pid == 13) { cart.reorganize(); return; }
    let last = cart.items[cart.items.length - 1];
    if (last && last.pid == pid) { last.qty++; } 
    else { cart.items.push({ pid: pid, qty: 1 }); }
    cart.save(); cart.list();
  },

  change : (idx, qty) => {
    if (qty <= 0) { cart.remove(idx); } 
    else { cart.items[idx].qty = qty; cart.save(); cart.list(); }
  },

  remove : (idx) => { cart.items.splice(idx, 1); cart.save(); cart.list(); }
};

window.addEventListener("DOMContentLoaded", cart.init);