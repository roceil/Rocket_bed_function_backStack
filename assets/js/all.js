"use strict";

var route = "rocket-frank";
var token = "xWFBP5xYVHNDhUnNY6F5oYdQSIB3";
var newData = []; // DOM => 表格內的tbody

var tbody_table = document.querySelector("#tbody"); // DOM => 表格外的刪除所有訂單按鈕

var deleteAllOrder_btn = document.querySelector("#deleteAllOrder");
axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(route, "/orders\n"), {
  headers: {
    authorization: token
  }
}).then(function (res) {
  newData = res.data["orders"].sort(function (a, b) {
    return b["createdAt"] - a["createdAt"];
  });
  getData();
  renderC3_allProduct();
  renderC3_allTitle();
}); // 函式 => 渲染整個類別營收C3

function renderC3_allProduct() {
  var checkedData = {};
  newData.forEach(function (cartItem) {
    cartItem["products"].forEach(function (productItem) {
      if (checkedData[productItem["category"]] === undefined) {
        checkedData[productItem["category"]] = productItem["price"];
      } else {
        checkedData[productItem["category"]] += productItem["price"];
      }
    });
  });
  var renderObj = Object.entries(checkedData);
  var chart = c3.generate({
    data: {
      columns: renderObj,
      type: "donut",
      onclick: function onclick(d, i) {
        console.log("onclick", d, i);
      },
      onmouseover: function onmouseover(d, i) {
        console.log("onmouseover", d, i);
      },
      onmouseout: function onmouseout(d, i) {
        console.log("onmouseout", d, i);
      }
    },
    donut: {
      title: "全產品類別營收比重"
    }
  });
} // 函式 => 渲染整個品項營收C3


function renderC3_allTitle() {
  var checkedData = {};
  newData.forEach(function (cartItem) {
    cartItem["products"].forEach(function (productItem) {
      if (checkedData[productItem["title"]] === undefined) {
        checkedData[productItem["title"]] = productItem["price"];
      } else {
        checkedData[productItem["title"]] += productItem["price"];
      }
    });
  });
  var renderObj = Object.entries(checkedData);
  var chart = c3.generate({
    bindto: "#chart1",
    data: {
      columns: renderObj,
      type: "donut",
      onclick: function onclick(d, i) {
        console.log("onclick", d, i);
      },
      onmouseover: function onmouseover(d, i) {
        console.log("onmouseover", d, i);
      },
      onmouseout: function onmouseout(d, i) {
        console.log("onmouseout", d, i);
      }
    },
    donut: {
      title: "全品項營收比重"
    }
  });
} // 函式 => 渲染整個表格


function getData() {
  var tbodyStr = "";
  newData.forEach(function (item) {
    // !時間格式
    var time = moment(item["createdAt"], "X").format("YYYY-MM-DD");

    if (item["paid"]) {
      tbodyStr += "<tr>\n      <td>".concat(item["id"], "</td>\n      <td>\n        ").concat(item["user"]["name"], "<br />\n        ").concat(item["user"]["tel"], "\n      </td>\n      <td>").concat(item["user"]["address"], "</td>\n      <td>").concat(item["user"]["email"], "</td>\n      <td>").concat(item["products"][0]["title"], "</td>\n      <td>").concat(time, "</td>\n      <td><button id=\"changeStatusBtn\" data-id=").concat(item["id"], " paid-status=").concat(item["paid"], "  class=\"btn btn-success changeStatusBtn\">\u5DF2\u8655\u7406</button></td>\n      <td><button id='deleteBtn' data-id=").concat(item["id"], " class=\"btn btn-delete\">\u522A\u9664</button></td>\n    </tr>");
    } else {
      tbodyStr += "<tr>\n      <td>".concat(item["id"], "</td>\n      <td>\n        ").concat(item["user"]["name"], "<br />\n        ").concat(item["user"]["tel"], "\n      </td>\n      <td>").concat(item["user"]["address"], "</td>\n      <td>").concat(item["user"]["email"], "</td>\n      <td>").concat(item["products"][0]["title"], "</td>\n      <td>").concat(time, "</td>\n      <td><button id=\"changeStatusBtn\" data-id=").concat(item["id"], " paid-status=").concat(item["paid"], "  class=\"btn btn-warning changeStatusBtn\">\u672A\u8655\u7406</button></td>\n      <td><button id='deleteBtn' data-id=").concat(item["id"], " class=\"btn btn-delete\">\u522A\u9664</button></td>\n    </tr>");
    }
  });
  tbody_table.innerHTML = tbodyStr; // *訂單編號 => res.data["orders"][0]['products'][0]['id']
  // *聯絡人 => res.data['orders'][0]['user']['name']
  // *電話 => res.data['orders'][0]['user']['tel']
  // *聯絡地址 => res.data['orders'][0]['user']['address']
  // *電子郵件 => res.data['orders'][0]['user']['email']
  // *訂單品項 => res.data["orders"][0]["products"][0]["title"]
  // *訂單日期 => res.data["orders"][0]['createdAt']
} // 函式 => 刪除指定訂單


function deleteOrder(e) {
  newData.forEach(function (item, index) {
    if (item["id"] === e.target.getAttribute("data-id")) {
      newData.splice(index, 1);
    }
  });
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(route, "/orders/").concat(e.target.getAttribute("data-id")), {
    headers: {
      authorization: token
    }
  }).then(function (res) {
    console.log(res.data);
  })["catch"](function (err) {
    console.log(err);
    window.location.reload();
    alert("訂單刪除失敗");
  });
} // 函式 => 刪除所有訂單


function deleteAllOrder() {
  // newData.forEach((item, index) => {
  //   if (item["id"] === e.target.getAttribute("data-id")) {
  //     newData.splice(index, 1);
  //   }
  // });
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(route, "/orders"), {
    headers: {
      authorization: token
    }
  }).then(function (res) {
    console.log(res.data);
    newData = [];
    getData();
  })["catch"](function (err) {
    console.log(err);
    window.location.reload();
    alert("訂單刪除失敗");
  });
} // 函式 => 修改指定訂單的處理狀態


function changeOrderStatus(e) {
  // $('#changeStatusBtn').toggleClass(function(index){
  //   console.log(index);
  // });
  // newData.forEach((item, index) => {
  //   if (item["id"] === e.target.getAttribute("data-id")) {
  //   }
  // });
  var payResult = e.target.getAttribute("paid-status") === "true" ? true : false;
  axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(route, "/orders/"), {
    data: {
      id: "".concat(e.target.getAttribute("data-id")),
      paid: !payResult
    }
  }, {
    headers: {
      Authorization: token
    }
  }).then(function (res) {
    console.log(res.data);
  })["catch"](function (err) {
    console.log(err);
    alert("訂單狀態更改失敗");
    getData();
  });
} // 監聽 => 監聽整個表格內容是否按到刪除鈕


tbody_table.addEventListener("click", function (e) {
  if (e.target.id === "deleteBtn") {
    deleteOrder(e);
    getData();
  }

  if (e.target.id === "changeStatusBtn") {
    changeOrderStatus(e);

    if (e.target.textContent === "未處理") {
      alert("狀態更改成功");
      $(e.target).addClass("btn-success").text("已處理");
    } else {
      alert("狀態更改成功");
      $(e.target).removeClass("btn-success").addClass("btn-warning").text("未處理");
    }
  }
}); // 監聽 => 監聽表格外的刪除所有訂單按鈕

deleteAllOrder_btn.addEventListener("click", function (e) {
  console.log(123);
  deleteAllOrder();
});
//# sourceMappingURL=all.js.map
