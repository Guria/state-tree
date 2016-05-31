var React = require('react');

function hasPath(path, changes) {
  return path.split('.').reduce(function (changes, key) {
    return changes[key];
  }, changes);
}

module.exports = function (Component, paths) {
  return React.createClass({
    contextTypes: {
      tree: React.PropTypes.object
    },
    componentWillMount() {
      this.context.tree.subscribe(this.update);
    },
    componentWillUnmount() {
      this.context.tree.unsubscribe(this.update);
    },
    update(changes) {
      for (var key in paths) {
        if (hasPath(paths[key], changes)) {
          return this.forceUpdate();
        }
      }
    },
    getProps() {
      var tree = this.context.tree;
      var props = this.props || {};
      var propsToPass = Object.keys(paths || {}).reduce(function (props, key) {
        props[key] = tree.get(paths[key]);
        return props
      }, {})

      propsToPass = Object.keys(props).reduce(function (propsToPass, key) {
        propsToPass[key] = props[key]
        return propsToPass
      }, propsToPass)

      return propsToPass
    },
    render() {
      return React.createElement(Component, this.getProps())
    }
  });
}