import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

require('es6-promise').polyfill();
require('isomorphic-fetch');

let url =
  'https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';

const Quote = props => {
  return (
    <blockquote className="quoteBox" id="quote-box">
      {props.quote}
    </blockquote>
  );
};

const Author = props => {
  return <div className="authorBox">{props.author}</div>;
};
const Spinner = () => {
  return <i className="fas fa-spinner fa-spin fa-pulse" />;
};

const Footer = props => {
  return (
    <div className="footerBox">
      Built by:
      <a
        href="https://xarrijorge.com"
        className="href"
        target="_blank"
        rel="noopener noreferrer">
        Xarri Jorge
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/xarrijorge">
        <i className="fab fa-github" />
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://twitter.com/xarrijorge">
        <i className="fab fa-twitter" />
      </a>
    </div>
  );
};
class QuoteButton extends Component {
  render() {
    return (
      <button className="actionButton" onClick={this.props.handleClick || null}>
        {this.props.buttonText}
      </button>
    );
  }
}
class TweetButton extends React.Component {
  render() {
    let linkText = `https://twitter.com/intent/tweet?text=${
      this.props.quote
    } - ${this.props.author}`;
    return (
      <div>
        {this.props.quote !== '' ? (
          <button className="tweetButton actionButton">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={linkText}
              data-size="large">
              Tweet
            </a>
          </button>
        ) : null}
      </div>
    );
  }
}
class App extends React.Component {
  state = {
    quote:
      'Only put off until tomorrow what you are willing to die having left undone',
    author: '*Pablo Picasso',
    buttonText: <Spinner />,
    loading: false,
  };

  handleClick = () => {
    this.setState({
      loading: true,
    });
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json);
        if (!json.quoteAuthor) {
          json.quoteAuthor = 'Anonymous';
        }
        this.setState({
          loading: false,
          quote: `"${json.quoteText}"`,
          author: `*${json.quoteAuthor}`,
          buttonText: 'New Quote',
        });
      })
      .catch(ex => {
        console.log('parsing failed', ex);
      });
  };

  componentDidMount(e) {
    setInterval(this.handleClick, 60000);
  }
  componentWillUnmount() {
    clearTimeout();
  }
  render() {
    return (
      <div className="app">
        <div className="mainBox">
          <Quote quote={this.state.quote} />
          <Author author={this.state.author} />
          <div className="buttons">
            <QuoteButton
              handleClick={this.handleClick}
              buttonText={this.state.loading ? <Spinner /> : 'New Quote'}
            />

            <TweetButton quote={this.state.quote} author={this.state.author} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
