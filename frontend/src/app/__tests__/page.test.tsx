import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DashboardPage from '../page';

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="icon-arrow-right" />,
  FileText: () => <span data-testid="icon-file-text" />,
  Sparkles: () => <span data-testid="icon-sparkles" />,
  Clock: () => <span data-testid="icon-clock" />,
  CheckCircle: () => <span data-testid="icon-check-circle" />,
  TrendingUp: () => <span data-testid="icon-trending-up" />,
  Activity: () => <span data-testid="icon-activity" />,
  Plus: () => <span data-testid="icon-plus" />
}));

// Mock the Sidebar and Header components
jest.mock('@/components/layout/Sidebar', () => ({
  Sidebar: () => <div data-testid="mock-sidebar">Sidebar</div>
}));

jest.mock('@/components/layout/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

describe('DashboardPage', () => {
  it('renders without crashing', () => {
    render(<DashboardPage />);
    
    // Check for the welcome text
    expect(screen.getByText('Welcome back, Researcher')).toBeInTheDocument();
    
    // Check for mocked layout components
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    
    // Check for some static text indicating widgets are rendered
    expect(screen.getByText('Active Drafts')).toBeInTheDocument();
    expect(screen.getByText('Grants Discovered')).toBeInTheDocument();
    expect(screen.getByText('Recent Proposals')).toBeInTheDocument();
  });
});
