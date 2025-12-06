import { render, screen } from '@testing-library/react'
import { EventCard } from '../event-card'

describe('EventCard', () => {
  const mockProps = {
    title: 'Test Event',
    date: '10 Oct, 2023',
    location: 'Test Venue',
    price: '$500 MXN',
  }

  it('renders event details correctly', () => {
    render(<EventCard {...mockProps} />)

    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText(/10 Oct, 2023/)).toBeInTheDocument()
    expect(screen.getByText(/Test Venue/)).toBeInTheDocument()
    expect(screen.getByText('$500 MXN')).toBeInTheDocument()
  })

  it('renders buy button', () => {
    render(<EventCard {...mockProps} />)
    const button = screen.getByRole('button', { name: /comprar tickets/i })
    expect(button).toBeInTheDocument()
  })
})