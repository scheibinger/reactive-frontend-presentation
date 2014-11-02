$(function () {

    function Model() {
        function firstName() {
            function isValid(value) {
                return value && /^([a-zA-Z]+)$/.test(value);
            }

            var value = new Rx.BehaviorSubject("");
            var valid = value.map(isValid);

            return {
                value: value,
                valid: valid
            }
        }

        var valid = Rx.Observable.combineLatest(
            firstName.valid,
            function (firstNameValid) {
                 return firstNameValid;
            });

        return {
            valid: valid,
            firstName:firstName()
        }
    }

    function log(value) {
        var $log = $("p.log");
        $log.append("<div>" + value + "</div>");
    }

    function InputWidget($domShard, model) {
        var $input = $domShard.find("input");
        var $label = $domShard.find("label");
        var $icon = $domShard.find(".glyphicon");

        var inputObservable = $input.keyupAsObservable()
            .throttle(500)
            .map(function (ev) {
                return ev.target.value;
            });

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

        model.value.subscribe(function (value) {
            log("model.subscribe fired with: " + value + "");
            render(value);
        });

        model.valid.subscribe(function(isValid){
            isValid ? showValid() : showError();
        });

        inputObservable.subscribe(function (value) {
            log("inputObservable.subscribe fired with: " + value + "");
            model.value.onNext(value);
        })
    }

    function DropdownWidget($domShard, model) {
        var $select = $("select");
        var $label = $domShard.find("label");
        var $icon = $domShard.find(".glyphicon");

        var selectObservable = $select.changeAsObservable()
            .map(function (ev) {
                return ev.target.value;
            });

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

        model.value.subscribe(function (value) {
            log("select model.subscribe fired with: " + value + "");
            render(value);
        });

        selectObservable.subscribe(function (value) {
            log("selectObservable.subscribe fired with: " + value + "");
            model.value.onNext(value);
        })

    }

    function CheckBoxWidget($domShard, model) {

    }

    function ButtonWidget($domShard, model) {
        var $button = $domShard.find("button");

        function toggleDisabled(state) {
            $button.toggleClass("disabled", state);
        }

        model.valid.subscribe(function (isValid) {
            log("button toggle disabled: "+isValid);
            toggleDisabled(!isValid)
        });
    }

    var model = new Model();

    new InputWidget($("#firstname-input-widget"), model.firstName);
    new ButtonWidget($("#submit-button-widget"), model);

    window.model = model;
    //new DropdownWidget(model.color);
});
