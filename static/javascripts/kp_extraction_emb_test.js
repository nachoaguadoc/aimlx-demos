function submit(input_text, number_keyphrases) {
    $("#last_group").append('<i class="fa fa-spinner fa-spin" id="spinner"></i>');
    $('#input_text').val(input_text);

    url = "http://52.30.254.33:1277/api/kp";
    data = {
        'inp_url': input_text,
        'nbkp': number_keyphrases
    };
    $.ajax({
        url: "http://52.30.254.33:1277/api/kp",
        type: "POST",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(data),
        success: function (data) {
            //Process the JSON
            $("#spinner").remove();
            var itemList = document.getElementById("list-group");

            //Loop trough the JSON
            data
                .api_result
                .forEach(function (element) {
                    element.relevance *= 100;
                    var probability = element.relevance;
                    itemList.insertAdjacentHTML('beforeend', "<li data-time='" + probability + "' class='list-group-item' style='background : linear-gradient(90deg, #c6e3fd " + probability + "%, #FFFFFF 0%); text-shadow: none'>  <b>" + element.label + "</b> </li>");
                    if (element.aliases.length > 0) {
                        for (var i = 0; i < element.aliases.length; i++) {
                            probability -= 0.000001;
                            itemList.insertAdjacentHTML('beforeend', "<li data-time='" + probability + "' class='list-group-item' style='background : linear-gradient(90deg, #daedfd " + probability + "%, #FFFFFF 0%); text-shadow: none'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + element.aliases[i] + "</li>");
                        }
                    };
                });

            //Process text
            var textlist = document.getElementById("html_doc");
            var processed_text = data.processed_text;
            processed_text = processed_text.replace(/(\r\n\t|\n|\r\t)/gm, '</div><div class=start></br>');
            textlist.insertAdjacentHTML('beforeend', "<div class='start'>" + processed_text);
            textlist.innerHTML = textlist
                .innerHTML
                .replace(/<phrase>/g, '<span class=kp>')
                .replace(/<\/phrase>/g, '</span>');
            textlist.style.paddingLeft = '10px';

            //Sort <li> elements
            var listItems = $('.list-group-item');
            listItems.sort(function (a, b) {
                return + $(b).data('time') - + $(a).data('time');
            });
            listItems.appendTo('#list-group');

            //hide scrollbar
            var docHeight = $('#html_doc').height();
            var groupHeight = $('#list-group').height();

            if (docHeight < 700) {
                document
                    .getElementById("html_doc")
                    .style
                    .overflowY = "hidden";
            }
            if (groupHeight < 700) {
                document
                    .getElementById("list-group")
                    .style
                    .overflowY = "hidden";
            }
            if (groupHeight > docHeight) {
                docHeight = groupHeight;
                document
                    .getElementById("html_doc")
                    .style
                    .height = groupHeight + 'px';
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {},
        timeout: 120000
    });
}

$(document)
    .ready(function () {

        $('#input_text')
            .keyup(function (e) {
                if (e.keyCode == 13) {
                    input_text = $('#input_text').val();
                    number_keyphrases = $('#nbkp').val();
                    if (input_text != '') 
                        submit(input_text, number_keyphrases);
                    }
                });

        $('#search_button').click(function (e) {
            input_text = $('#input_text').val();
            number_keyphrases = $('#nbkp').val();
            if (input_text != '') 
                submit(input_text, number_keyphrases);
            }
        )
    });