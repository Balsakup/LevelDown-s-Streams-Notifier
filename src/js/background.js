$.ajax({
    type: 'GET',
    url : 'https://www.balsakup.fr',
    success: function(data) {
        console.log(data)
    },
    error: function(error) {
        console.log(error)
    }
});
