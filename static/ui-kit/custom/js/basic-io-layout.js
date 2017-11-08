var BasicIoLayout = {
    samples: [],
    sampleLink: '',
    numberOfSamples: 8,
    samplesDisplay: [],
    config: function () {
        this.initializeUiElements()
    },
    initializeUiElements: function () {
        this.initializeTabs()
    },
    initializeTabs: function () {
        $('.aix-tab-content').slice(1).hide();
        $('.aix-tab-menu li a').eq(0).addClass('active');
        $('.aix-tab-menu li a').click(function (e) {
            e.preventDefault();
            var content = $(this).attr('href');
            $(this).addClass('active');
            $(this).parent().siblings().children().removeClass('active');
            $(content).show();
            $(content).siblings('.aix-tab-content').hide();
        });
    }
};


