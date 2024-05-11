import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Homepage from './components/Homepage.jsx'
import EventForm from './components/EventForm.jsx'


const router = createBrowserRouter([
    {
        path:'/',
        element: <Homepage />,
        exact: true
    },
    {
        path: '/create-event',
        element: <EventForm />

    }
])
ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router = {router} />
    // <App />
)
