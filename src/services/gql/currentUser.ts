import { gql } from 'graphql-request'

export default gql`query CurrentUser {
    currentUser {
        id
    }
}`