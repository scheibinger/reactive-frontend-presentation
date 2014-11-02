$(function () {

    //todo: - Make model observable
    //todo: - Make valid dependant on value and map using isValid
    function createFormDataModel() {
        function firstNameModel() {
            var value = new Rx.BehaviorSubject(""),
                valid =  value.map(function(value){
                    return isValid(value);
                });

            function isValid(value) {
                return value && /^([a-zA-Z]+)$/.test(value);
            }

            return {
                value: value,
                valid: valid
            }
        }

        var valid;

        return {
            valid: valid,
            firstName: firstNameModel()
        }
    }

    function log(value) {
        var $log = $("p.log");
        $log.append("<div>" + value + "</div>");
    }

    //todo: - implement two way binding:
    //todo:   - Stream events from user inputs
    //todo:   - Subscribe for model changes
    function inputWidget($domShard, model) {
        var $input = $domShard.find("input");
        var $icon = $domShard.find(".glyphicon");

        function render(value) {
            $input.val(value);
        }

        function showError() {
            $domShard.addClass("has-error");
            $domShard.removeClass("has-success");
            $icon.removeClass("glyphicon-ok");
            $icon.addClass("glyphicon-remove");
        }

        function showValid() {
            $domShard.removeClass("has-error");
            $domShard.addClass("has-success");
            $icon.removeClass("glyphicon-remove");
            $icon.addClass("glyphicon-ok");
        }

        model.value.subscribe(function(value){
             render(value);
        });

        var inputKeyUpStream = $input.keyupAsObservable()
            .throttle(500)
            .map(function(ev){
                 return ev.target.value;
            });

        inputKeyUpStream.subscribe(function(value){
             model.value.onNext(value);
        });

        model.valid.subscribe(function(isValid){
            log(isValid);
            isValid ? showValid() : showError();
        })

    }

    function dropdownWidget($domShard, model) {
        var $select = $("select");
        var $icon = $domShard.find(".glyphicon");

        function render(value) {
            $select.val(value);
        }

        function showError() {
            $domShard.addClass("has-error");
            $domShard.removeClass("has-success");
            $icon.removeClass("glyphicon-ok");
            $icon.addClass("glyphicon-remove");
        }

        function showValid() {
            $domShard.removeClass("has-error");
            $domShard.addClass("has-success");
            $icon.removeClass("glyphicon-remove");
            $icon.addClass("glyphicon-ok");
        }
    }

    //todo: subscribe for model.valid stream
    function buttonWidget($domShard, model) {
        var $button = $domShard.find("button");

        function toggleDisabled(state) {
            $button.toggleClass("disabled", state);
        }
    }

    var model = createFormDataModel();

    inputWidget($("#firstname-input-widget"), model.firstName);
    buttonWidget($("#submit-button-widget"), model);

    window.model = model;
});
