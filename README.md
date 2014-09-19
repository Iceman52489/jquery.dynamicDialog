jQuery.dynamicDialog
==============================

jQuery Automated AJAX Dialog for Bootstrap 2.3.2

# Requirements

- jQuery 1.9.1
- jQuery Migrate
- Bootstrap CSS
- Bootstrap Dialog Component

# Usage

1. ```html
<a class="<custom-class>" class="btn btn-info" href="<ajax-url>"AJAX Me!</a>
```
2. ```javascript
    $(function() {
        $('.<custom-class>').dynamicDialog(<options>);
    });
```

# Options

```json
{
    header: "",
    body "",

    // Buttons
    save: "",
    saveText: "Save Changes",
    saveClass: "primary",       // info|cancel|info|inverse|danger

    close: function() { },
    closeText: "Close",
    closeClass: "",             // info|cancel|info|inverse|danger

    width: "50%",
    height: "80%",
    trigger: "click",
    ajaxCallback: "",
    ajaxURL: ""
}
```
