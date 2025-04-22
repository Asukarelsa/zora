import { createClient, Client } from 'graphql-ws';

interface CoinSwapActivity {
  node: {
    activityType: string;
    coinAmount: string;
    currencyAmount: string;
    /* …trimmed: add the rest if you need strict typing … */
  };
  cursor: string;
}

export function subscribeToLastTradedWidget(
  wsUrl: string,
  onData: (event: CoinSwapActivity) => void,
  onError?: (err: unknown) => void,
) {
  const client: Client = createClient({
    url: wsUrl,
    // Need auth?  Supply headers here via connectionParams:
    // connectionParams: async () => ({ Authorization: `Bearer ${token}` }),
    lazy: false,          // connect immediately
    retryAttempts: 5,     // automatic reconnects
    shouldRetry: () => true,
  });

  // Returns an unsubscribe function
  return client.subscribe(
    {
      id: 'f31f98b0-4377-46d2-8cf8-3f70965cae67',
      operationName: 'LastTradedWidgetSubscription',
      query: /* GraphQL */ `
        subscription LastTradedWidgetSubscription {
          onAllCoinSwapActivity {
            node {
              activityType
              coinAmount
              currencyAmount
              recipientProfile {
                handle
                avatar { icon }
                id
              }
              coin {
                chainId
                address
                name
                creatorProfile { handle id }
                mediaContent { previewImage { icon } }
                id
              }
              id
            }
            cursor
          }
        }
      `,
      variables: {},
    },
    {
      next: ({ data }) => data && onData(data.onAllCoinSwapActivity),
      error: onError ?? ((e) => console.error('Subscription error', e)),
      complete: () => console.info('Subscription completed'),
    },
  );
}
