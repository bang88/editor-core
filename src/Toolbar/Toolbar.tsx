import * as React from 'react';
import { Map } from 'immutable';
import { Plugin } from '../EditorCore';

import ToolbarLine from './ToolbarLine';

export interface ToolbarProps {
  plugins: Array<Plugin>;
  toolbars: Array<any>;
  prefixCls: string;
  className: string;
}

function noop() {}

export default class Toolbar extends React.Component<ToolbarProps, any> {
  public pluginsMap : Map<any, any>;
  constructor(props) {
    super(props);
    const map = {};
    props.plugins.forEach((plugin: Plugin) => {
      map[plugin.name] = plugin;
    });
    this.pluginsMap = Map(map);
    this.state = {
      toolbars: [],
    };
  }
  public componentWillMount() {
    const toolbars = this.props.toolbars.map((toolbar, idx) => {
      const children = React.Children.map(toolbar, this.renderToolbarItem.bind(this));
      return (<ToolbarLine key={`toolbar-${idx}`}>{children}</ToolbarLine>);
    });
    this.setState({
      toolbars,
    });
  }

  public renderToolbarItem(pluginName, idx) {
    const element = this.pluginsMap.get(pluginName);
    if (element && element.component) {
      const { component } = element;
      const props = {
        key: `toolbar-item-${idx}`,
        onClick: component.props ? component.props.onClick : noop ,
      };
      if (React.isValidElement(component)) {
        return React.cloneElement(component, props);
      }
      return React.createElement(component, props);
    }
    return null;
  }

  render() {
    const { toolbars } = this.state;
    const { prefixCls } = this.props;
    return <div className={`${prefixCls}-toolbar`}>{toolbars}</div>
  }
}