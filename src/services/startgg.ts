import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import currentUser from './gql/currentUser'
import { RootState } from '../redux/LiveConfig/store'

export const startggApi = createApi({
  reducerPath: 'startggApi',
  baseQuery: graphqlRequestBaseQuery({
    url: 'https://api.start.gg/gql/alpha',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).app.apiToken;
  
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
  
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<boolean, string>({
      queryFn: async (arg, api, extraOptions, _baseQuery) => {
        const baseQuery = graphqlRequestBaseQuery({
          url: 'https://api.start.gg/gql/alpha',
          prepareHeaders: (headers, { getState }) => {
            headers.set('authorization', `Bearer ${arg}`)
            return headers
          },
        })

        try {
          const response = await baseQuery({document: currentUser}, api, extraOptions);
          return { data: response.error === undefined };
        } catch (queryError) {
          return { data: false };
        }

      }
    }),
  }),
})

export const { useLoginMutation } = startggApi