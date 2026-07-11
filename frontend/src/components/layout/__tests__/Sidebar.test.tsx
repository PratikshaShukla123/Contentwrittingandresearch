import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Sidebar';

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  LayoutDashboard: () => <span data-testid="icon-layout-dashboard" />,
  FileText: () => <span data-testid="icon-file-text" />,
  Search: () => <span data-testid="icon-search" />,
  Settings: () => <span data-testid="icon-settings" />,
  PieChart: () => <span data-testid="icon-pie-chart" />,
  CheckCircle: () => <span data-testid="icon-check-circle" />
}));

describe('Sidebar', () => {
  it('renders branding and navigation links', () => {
    render(<Sidebar />);
    
    // Check for branding
    expect(screen.getByText('GrantAI')).toBeInTheDocument();
    
    // Check for navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('Proposal Editor')).toBeInTheDocument();
    expect(screen.getByText('Compliance Node')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    
    // Check that links have correct hrefs
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
    expect(dashboardLink).toHaveAttribute('href', '/');
    
    const workspaceLink = screen.getByRole('link', { name: /Workspace/i });
    expect(workspaceLink).toHaveAttribute('href', '/workspace');
  });
});
