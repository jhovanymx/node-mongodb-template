$(document).ready(function(){
    $(".delete-country").click(function(e){
        var $target = $(e.target);
        const id = $target.attr("data-id");
        $.ajax({
            type: "DELETE",
            url: "/country/" + id,
            success: function(response){
                alert("Country Removed");
                window.location.href = "/";
            },
            error: function(err){
                console.error(err);
            }
        });
    });
});