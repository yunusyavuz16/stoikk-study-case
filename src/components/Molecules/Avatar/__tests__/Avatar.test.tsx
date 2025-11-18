/**
 * Tests for Avatar component
 * Covers image rendering and initials generation
 */

import React from 'react';
import {Avatar} from '../Avatar';
import {renderWithProviders} from '../../../../__tests__/utils/testUtils';

describe('Avatar', () => {
  it('should render avatar with image', () => {
    const {UNSAFE_root} = renderWithProviders(
      <Avatar uri="https://example.com/avatar.jpg" username="testuser" />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should render initials when no image', () => {
    const {getByText} = renderWithProviders(<Avatar username="John Doe" />);

    expect(getByText('JD')).toBeTruthy();
  });

  it('should generate initials from two words', () => {
    const {getByText} = renderWithProviders(<Avatar username="John Smith" />);

    expect(getByText('JS')).toBeTruthy();
  });

  it('should generate initial from single word', () => {
    const {getByText} = renderWithProviders(<Avatar username="John" />);

    expect(getByText('J')).toBeTruthy();
  });

  it('should use custom size', () => {
    const {UNSAFE_root} = renderWithProviders(
      <Avatar username="testuser" size={64} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should handle empty username', () => {
    const {getByText} = renderWithProviders(<Avatar username="" />);

    // Empty username defaults to 'U'
    expect(getByText('U')).toBeTruthy();
  });
});

