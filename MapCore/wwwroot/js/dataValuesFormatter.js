function getvaluesFormatter(value, format_id) {
    if (format_id == 2) {
        if (value >= 0) {
            var result = value;
            nStr = result;
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            result = x1 + x2;
            result = result * 100 / 100;
            result = result.toFixed(2);
            var pct = '%';
            return result + pct;
        } else if (value < 0) {
            var result = value;
            nStr = result;
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            result = x1 + x2;
            result = result * 100 / 100;
            result = result.toFixed(2);
            var pct = '%';
            return result + pct;
        }
        return value;
    } else if (format_id == 3) {
        if (value > 0) {

            var result = value;

            nStr = result;
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            result = x1 + x2;
                if (value >= 1000000) {
                    result = (value / 1000000).toFixed(2) + "M";
                }
                if (value >= 1000 & value <= 1000000) {
                    result = (value / 1000).toFixed(2) + "K";
                }
            result = "$" + result;
            result = result;
            return result;
        } else if (value < 0) {
            var result = value;
            nStr = result;
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            result = x1 + x2;
            result = "$" + result;
            result = result;
            return result;
        } else if (value == 0) {
            result = "$" + value;
            return result;
        }
        return value;
    } else if (format_id == 4) {
        var result = value;
        nStr = result;
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        result = x1 + x2;

        // var val = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return result;
    } else if (format_id == 1) {
        if (isNaN(value)) {
            return value;
        }
        return parseFloat(value).toFixed(2);
    } else {
        return value;
    }
}