// jshint devel:true
console.log('\'Allo \'Allo!');

// load nytimes:
$(document).ready(function() {
  nyt('obamacare');
});
function get( src, query ) {
    const request = new XMLHttpRequest();
    let url;

    if ( src === 'sunlight') {
        url = 'https://congress.api.sunlightfoundation.com/documents/search?' +
              'query=' + query + '&apikey=18a4e7908bc444e8a506f970d12f1a5a';
    }

    request.open('GET', url, true);
    // request.withCredentials = true;
    // request.setRequestHeader('X-APIKEY', '18a4e7908bc444e8a506f970d12f1a5a');

    request.onload = ()=> {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            // var data = JSON.parse(request.responseText);
            return request.responseText;
        } else {
            // We reached our target server, but it returned an error
            console.warn(request.statusText);
        }
   };

    request.onerror = ()=> {
        // There was a connection error of some sort
        console.error('Failed Network Connection');
    };

    request.send();
}

const SearchForm = React.createClass({
    render () {
        return (
            <form>
                <div className="form-group">
                    <input type="text" className="form-control" id="search_terms" placeholder="Search for..." />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" id="location" placeholder="Location" />
                </div>
                <button type="submit" className="btn btn-default">Submit</button>
            </form>
        )
    }
});

const SunlightWidget = React.createClass({
    getDefaultProps () {
        data: {}
    },
    componentDidMount () {
        this.props.data = get( 'sunlight', 'Shark Attacks' );
    },
    render () {
        return (
            <div>
                <p>{ this.props.data }</p>
            </div>
        );
    }
});

React.render(
    <SunlightWidget />, document.getElementById('sl-widget')
);

React.render(
    <SearchForm />, document.getElementById('form-search')
);
