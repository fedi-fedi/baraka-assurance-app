import { Component, ReactNode } from 'react';
import {
  Button,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  tokens,
  makeStaticStyles,
} from '@fluentui/react-components';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

makeStaticStyles({
  '.baraka-error-boundary': {
    padding: tokens.spacingHorizontalXXL,
    maxWidth: '720px',
    margin: '48px auto',
  },
});

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('[Baraka] erreur non interceptée', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="baraka-error-boundary" role="alert">
          <MessageBar intent="error">
            <MessageBarBody>
              <MessageBarTitle>Une erreur inattendue est survenue</MessageBarTitle>
              {this.state.error.message}
            </MessageBarBody>
          </MessageBar>
          <div style={{ marginTop: 16 }}>
            <Button appearance="primary" onClick={this.reset}>
              Réessayer
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
