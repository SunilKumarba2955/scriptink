newFunction();
function newFunction() {
  $(document).ready(function () {
    var category = $(".card-title").html();
    var result1 = "";
    var message = "";

    loadData("quotes", result1, message);

    $("#filter-section > button").on("click", function () {
      $("#filter-section > button").removeClass("active-button");
      $(this).addClass("active-button");
      $(".loading").show();
      $(".message").html(message);
      $("#articles").html(result1);
      $(".headers").css("height", "100vh");
      var list_name = $(this).text().toLowerCase();

      loadData(list_name, result1, message);
    });

    function loadData(type, result1, message) {
      var token = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");
      $.ajax({
        url: "/getData",
        method: "post",
        headers: {
          "CSRF-Token": token,
        },
        data: { type: type, category: category },
        success: function (result, status, xhr) {
          for (var i = 0; i < result.array.length; i++) {
            result1 += `
                            <li data-aos="zoom-in" style="background-image:url('${result.backimg[i]}');background-size:cover;background-position:center;display:flex;justify-content:center;align-items:center;border-radius:1rem">
                            
                              <p class="party-body">${result.array[i]}</p>
                         
                            </li>
                            `;
          }
          if (result.array.length === 0) {
            $(".headers").css("height", "100vh");
            $(".header-section .container").css("height", "100vh");
            message += `
                
                            <div class="center-div">
                              <p class="party-body">No Post Available</p>
                              </div>
                            `;
            $(".message").html(message);
            $(".loading").hide();
          } else {
            $(".headers").css("height", "auto");
            $(".header-section .container").css("height", "auto");
          }
          $("#articles").html(result1);
          $(".loading").hide();
        },
        error: function (xhr, status, error) {
          console.log("error");
        },
      });
    }
  });
}
