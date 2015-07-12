// load nytimes:
$(document).ready(function() {
  nyt('digital privacy');
});

// React app
function get( src, query ) {
    return new Promise( (res, rej) => {
        const request = new XMLHttpRequest();
        let url;

        if ( src === 'sunlight') {
            url = 'https://congress.api.sunlightfoundation.com/documents/search?' +
                  'query=' + query + '&apikey=18a4e7908bc444e8a506f970d12f1a5a';
        }

        request.open('GET', url, true);
        //TODO: Figure out why API key isn't passing and getting 200 response.
        // request.setRequestHeader('X-APIKEY', '18a4e7908bc444e8a506f970d12f1a5a');

        request.onload = ()=> {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var data = JSON.parse(request.response);
                res( data );
            } else {
                // We reached our target server, but it returned an error
                rej( console.warn(request.statusText) );
            }
       };

        request.onerror = ()=> {
            // There was a connection error of some sort
            rej( console.error('Failed Network Connection') );
        };

        request.send();
    });
}

const Loader = React.createClass({
    propTypes: {
        showContentWhen: React.PropTypes.bool.isRequired
    },
    render () {
        if ( this.props.showContentWhen ) {
            return <div key="content">{ this.props.children }</div>;
        } else {
            return <div>Loading...</div>;
        };
    }
});

const SearchForm = React.createClass({
    getInitialState () {
        return {
            submitted: false,
            search: ''
        };
    },
    handleClick: function(event) {
        this.setState({
            submitted: true,
            search: ''
        });
    },
    getFormData: function() {
        let data = {
              search: this.refs.search_terms.getDOMNode().value
            // , geoLocation: this.refs.location.getDOMNode().value
        }

        return data
    },
    render () {
        // TODO: Add location based searches
        // <div className="form-group">
        //     <input type="text" className="form-control" id="location" placeholder="Location" />
        // </div>
        return (
            <form>
                <div className="form-group">
                    <input type="text" className="form-control" id="search_terms" placeholder="Search for..." />
                </div>
                <button type="submit" onClick={ this.handleClick } className="btn btn-default">Submit</button>
            </form>
        )
    }
});

const SunlightWidget = React.createClass({
    getInitialState () {
        return {
            noData: true,
            loading: true,
            results: []
        };
    },
    componentDidMount () {
        new Promise( ( resolve, reject )=> {
            get( 'sunlight', 'Digital Privacy' ).then(
                ( data )=> {
                    if ( !data ) { return; }

                    return resolve( data.results );
                },
                ( err ) => {
                    return reject( console.error( 'Failed!', err ) );
                }
            );
        }).then( ( results )=> {
            this.setState({
                noData: false,
                loading: false,
                results: results.map(
                    (item, i)=> {
                        return <li className="list-group-item" key={ i }><a href={ item.source_url }>{ item.title }</a></li>
                    }
                )
            });
        });
    },
    render () {
        let defaultText = 'This widget searchs documents including the Government Accountability Office (GAO) Reports' +
                          ' and Inspector General Reports. These government oversight documents investigate misconduct,' +
                          ' waste and programs.'
        return (
            <div className="panel panel-default">
                <div className="panel-heading">GAO Documents (provided by the Sunlight Foundation)</div>
                <div className="panel-body"><p>{ defaultText }</p></div>
                <Loader showContentWhen={ !this.state.loading }>
                    { this.state.noData ? <p>No Results</p>
                      : <ul className="list-group">{ this.state.results }</ul> }
                </Loader>
            </div>
        );
    }
});

// React.render(
//     <SearchForm />, document.getElementById('form-search')
// );

React.render(
    <SunlightWidget />, document.getElementById('sl-widget')
);
