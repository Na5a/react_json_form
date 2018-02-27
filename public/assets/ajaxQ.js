/**
 * Created by nasa on 3/5/16.
 */

(function($) {
    // jQuery on an empty object, we are going to use this as our Queue
    var ajaxQ = $({});

    $.ajaxQ = $.fn.ajaxQ = function(url,ajaxOpts ) {
        var jqXHR,
            dfd = $.Deferred(),
            promise = dfd.promise();

        //normalize ajax options
        if(typeof ajaxOpts.dataType == 'undefined') ajaxOpts.dataType = 'json';
        if(typeof ajaxOpts.method == 'undefined') ajaxOpts.method = 'post';
        if(typeof ajaxOpts.data == 'undefined') ajaxOpts.data = {};

        // run the actual query
        function doRequest( next ) {
            jqXHR = $.ajax(url, ajaxOpts );
            jqXHR.done( dfd.resolve )
                .fail( dfd.reject )
                .then( next, next );
        }

        // queue our ajax request
        ajaxQ.queue( doRequest );

        // add the abort method
        promise.abort = function( statusText ) {

            // proxy abort to the jqXHR if it is active
            if ( jqXHR ) {
                return jqXHR.abort( statusText );
            }

            // if there wasn't already a jqXHR we need to remove from queue
            var queue = ajaxQ.queue(),
                index = $.inArray( doRequest, queue );

            if ( index > -1 ) {
                queue.splice( index, 1 );
            }

            // and then reject the deferred
            dfd.rejectWith( ajaxOpts.context || ajaxOpts, [ promise, statusText, "" ] );
            return promise;
        };

        return promise;
    };

})(jQuery);