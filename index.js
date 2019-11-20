import React, { useState } from "react"
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo';

import Layout from '../components/layout'

const CONTACT_MUTATION = gql`
  mutation CreateSubmissionMutation($clientMutationId: String!, $firstName: String!, $lastName: String!, $favoriteFood: String!, $message: String!){
    createSubmission(input: {clientMutationId: $clientMutationId, firstName: $firstName, lastName: $lastName, favoriteFood: $favoriteFood, message: $message}) {
      success
      data
    }
  }
`

const IndexPage = () => {

  const [firstNameValue, setFirstNameValue] = useState('')
  const [lastNameValue, setLastNameValue] = useState('')
  const [favoriteFoodValue, setFavoriteFoodValue] = useState('')
  const [messageValue, setMessageValue] = useState('')

  return (
    <Layout>
      <h1>Contact Form Submission to WordPress with GraphQL</h1>
      <Mutation mutation={CONTACT_MUTATION}>
        {(createSubmission, { loading, error, data }) => (
          <React.Fragment>
          <form
            onSubmit={async event => {
              event.preventDefault()
              createSubmission({
                variables: {
                  clientMutationId: 'example',
                  firstName: firstNameValue,
                  lastName: lastNameValue,
                  favoriteFood: favoriteFoodValue,
                  message: messageValue
                }
              })
            }}
          >

            <label htmlFor='firstNameInput'>First Name: </label>
            <input id='firstNameInput' value={firstNameValue}
              onChange={event => {
                setFirstNameValue(event.target.value)
              }}
            />

            <br /><br />

            <label htmlFor='lastNameInput'>Last Name: </label>
            <input id='lastNameInput' value={lastNameValue}
              onChange={event => {
                setLastNameValue(event.target.value)
              }}
            />

            <br /><br />

            <label htmlFor='favoriteFoodInput'>Favorite Food: </label>
            <select id='favoriteFoodNameInput' value={favoriteFoodValue}
              onChange={event => {
                setFavoriteFoodValue(event.target.value)
              }}
            >
              <option>Select one...</option>
              <option>Ribs</option>
              <option>Pho</option>
              <option>Beef Jerky</option>
            </select>

            <br /><br />

            <label htmlFor='messageInput'>Message: </label>
            <textarea id='messageInput' value={messageValue}
              onChange={event => {
                setMessageValue(event.target.value)
              }}
            >
            </textarea>

            <br /><br />

            <button type="submit">Send it!</button>

          </form>

          <div style={{ padding: '20px' }}>

            {loading && <p>Loading...</p>}
            {error && (
              <p>An unknown error has occured, please try again later...</p>
            )}
            {data && <p>yeah boi</p>}
          </div>
          </React.Fragment>
        )}
      </Mutation>
    </Layout>
  )

}

export default IndexPage;
