import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prepareButtons } from '../prepareButtons';
import { LOGIN_BUTTON_ID, BACK_TO_APP_BUTTON_ID } from '../constants';

describe('prepareButtons', () => {
  let mockIILoginButton: HTMLButtonElement;
  let mockBackToAppButton: HTMLButtonElement;

  beforeEach(() => {
    // Create mock buttons
    mockIILoginButton = document.createElement('button');
    mockIILoginButton.id = LOGIN_BUTTON_ID;
    mockBackToAppButton = document.createElement('button');
    mockBackToAppButton.id = BACK_TO_APP_BUTTON_ID;

    // Clear document body
    document.body.innerHTML = '';
  });

  it('should return buttons when they exist', () => {
    // Add buttons to document
    document.body.appendChild(mockIILoginButton);
    document.body.appendChild(mockBackToAppButton);

    const result = prepareButtons();

    expect(result.iiLoginButton).toBe(mockIILoginButton);
    expect(result.backToAppButton).toBe(mockBackToAppButton);
  });

  it('should throw error when II login button is missing', () => {
    // Add only back to app button
    document.body.appendChild(mockBackToAppButton);

    expect(() => prepareButtons()).toThrow('Required buttons not found');
  });

  it('should throw error when back to app button is missing', () => {
    // Add only II login button
    document.body.appendChild(mockIILoginButton);

    expect(() => prepareButtons()).toThrow('Required buttons not found');
  });

  it('should throw error when both buttons are missing', () => {
    expect(() => prepareButtons()).toThrow('Required buttons not found');
  });
});
