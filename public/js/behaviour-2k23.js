
$(document).ready(function () {
    var token = $('meta[name="csrf-token"]').attr("content");

    // Function to handle navbar changes
    var navbarChange = function () {
        if ($(".navbar").offset().top > 100) {
            $(".navbar, .dropdown-menu").addClass("navbar-transparent");
        } else {
            $(".navbar, .dropdown-menu").removeClass("navbar-transparent");
        }
    };

    // Attach navbarChange function to scroll event
    $(window).scroll(navbarChange);

    // Function to handle scroll behavior
    function scrollfunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    // Attach scrollfunction to scroll event
    window.onscroll = function () {
        scrollfunction();
    };

    // Function to scroll to the top
    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    // Attach topFunction to the click event of myBtn
    $("#myBtn").on("click", topFunction);

    // Close message on click
    $(".close").on("click", function () {
        $(".message").css({ display: "none" });
    });

    // Handle form submission
    $("#register").on("submit", function (e) {
        e.preventDefault();
        $(".message").css({ display: "none" });
        $(".loading").show();

        var name = $("#name").val();
        var usn = $("#usn").val();
        var email = $("#email").val();
        var phone = $("#phone").val();
        var city = $("#city").val();
        var college = $("#college").val();
        var collegeName = $("#collegeName").val();
        var referral = $("#referral").val();

        // Check if the user already exists
        $.ajax({
            url: "/checkUserExistence",
            method: "post",
            headers: { "CSRF-Token": token },
            data: { email: email, usn: usn, phone: phone },
            success: function (result, status, xhr) {
                if (result.message === "already exists") {
                    $(".message").css({ display: "block" });
                    $(".message").css({ "background-color": "red" });
                    $(".message-info").html("You have already registered. Please check your email for details. If you don't get email please contact us +91 9380812955 or +91 9019841867");
                    $(".btn-event").prop("disabled", false);
                    $(".loading").hide();
                } else {
                    // Continue with Razorpay payment
                    $.ajax({
                        url: "/createOrder",
                        method: "post",
                        headers: { "CSRF-Token": token },
                        data: { email, usn, college, referral },
                        success: function (result, status, xhr) {
                            if (result.message === "") {
                                $(".message").css({ display: "block" });
                                $(".message").css({ "background-color": "red" });
                                $(".message-info").html("Registration has not been started yet.");
                                $(".btn-event").prop("disabled", false);
                                $(".loading").hide();
                            } else if (result.message === "invalid code") {
                                $(".message").css({ display: "block" });
                                $(".message").css({ "background-color": "red" });
                                $(".message-info").html("Invalid Coupon code!");
                                $(".btn-event").prop("disabled", false);
                                $(".loading").hide();
                            } else {
                                // Continue with Razorpay payment
                                handleRazorpayPayment(result.message.id, name, email, usn, city, phone, collegeName, referral);
                            }
                        },
                        error: function (status, xhr, error) {
                            console.log(error);
                            $(".warning").hide();
                            $(".loading").hide();
                            $(".btn-event").prop("disabled", false);
                        },
                    });
                }
            },
            error: function (status, xhr, error) {
                console.log(error);
                $(".warning").hide();
                $(".loading").hide();
                $(".btn-event").prop("disabled", false);
            },
        });
    });

    // Function to handle Razorpay payment
    function handleRazorpayPayment(orderId, name, email, usn, city, phone, collegeName, referral) {
        var options = {
            key: 'rzp_test_nxYO70xQrTXPvM',  // Replace with your actual Razorpay key
            name: "WritoFest 2k23",
            description: "Registration Fee for WritoFest 2K23",
            image: "https://firebasestorage.googleapis.com/v0/b/android-app-5c25d.appspot.com/o/Captureaaaa.png?alt=media&token=a60216b2-e740-41e1-aa90-fcfaa9362ed3",
            order_id: orderId,
            handler: function (response) {
                $(".btn-event").prop("disabled", true);
                $(".loading").show();
                $(".warning").show();
    
                $.ajax({
                    url: "/registerParticipants",
                    method: "post",
                    headers: { "CSRF-Token": token },
                    data: {
                        name: name,
                        email: email,
                        usn: usn,
                        city: city,
                        phone: phone,
                        college: collegeName,
                        referral: referral,
                        razorpay_payment_id: response.razorpay_payment_id,
                        order_id: orderId,
                    },
                    success: function (result1, status, xhr) {
                        if (result1.message === "success") {
                            $(".message").css({ display: "block" });
                            $(".message").css({ "background-color": "green" });
                            $(".message-info").html(
                                "<p style='margin:0;'>You have Registered Successfully, soon you will get event details and payment confirmation from us via email. Hope we will see you on the day of event <br/> </p> Please Download our App from the Play store  <a class='message-anchor' href='https://play.google.com/store/apps/details?id=com.scriptink.official&hl=en'><i class='fab fa-google-play'></i>Get the App</a>"
                            );
                            $("#name").val("");
                            $("#email").val("");
                            $("#usn").val("");
                            $("#phone").val("");
                            $("#city").val("");
                            $("#college").val("");
                            $("#code").val("");
                            $("#referral").val("");
                            $("#writing").prop("checked", false);
                            $(".btn-event").prop("disabled", false);
                            $("#micOfMotivation").prop("checked", false);
                            $("#code").val("");
                            $("#collegeName").val("");
                            $(".loading").hide();
                            $(".warning").hide();
                        }
                    },
                    error: function (status, xhr, error) {
                        console.log(error);
                    },
                });
            },
            prefill: {
                name: name,
                email: email,
                contact: phone,
            },
            theme: {
                color: "#000", // Light green color
            },
            modal: {
                ondismiss: function () {
                    // Handle modal close event if needed
                    console.log("Razorpay modal closed");
                },
                onclose: function () {
                    // Handle modal close event if needed
                    console.log("Razorpay modal close event");
                },
                description: "Contact Sunil Kumar B A (+91 9380812955) and Padma KS (+91 9632147850) in case anything goes wrong."
            },
        };
    
        var rzp1 = new Razorpay(options);
        $(".loading").hide();
        rzp1.open();
    }
    
});