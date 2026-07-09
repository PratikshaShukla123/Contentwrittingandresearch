import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Sidebar } from '../components/layout/Sidebar'

describe('Sidebar Component', () => {
  it('renders the branding correctly', () => {
    render(<Sidebar />)
    expect(screen.getByText('GrantAI')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Sidebar />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Workspace')).toBeInTheDocument()
    expect(screen.getByText('Proposal Editor')).toBeInTheDocument()
  })
})
