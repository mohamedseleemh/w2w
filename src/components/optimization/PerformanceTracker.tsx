import React, { useEffect } from 'react';
import { databaseService } from '../../services/database';

interface PerformanceTrackerProps {
  enabled?: boolean;
}

const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({ enabled = true }) => {
  useEffect(() => {
    if (!enabled) return;

    // Track page load time
    const trackPageLoad = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        
        databaseService.trackEvent('page_load', {
          loadTime,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
      }
    };

    // Track user interactions
    const trackInteraction = (event: string, target: string) => {
      databaseService.trackEvent('user_interaction', {
        event,
        target,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    };

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrolled = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrolled > maxScrollDepth) {
        maxScrollDepth = scrolled;
        
        // Track milestones
        if ([25, 50, 75, 100].includes(scrolled)) {
          databaseService.trackEvent('scroll_depth', {
            depth: scrolled,
            url: window.location.href,
            timestamp: new Date().toISOString()
          });
        }
      }
    };

    // Track service clicks
    const trackServiceClick = (serviceName: string) => {
      databaseService.trackEvent('service_clicked', {
        serviceName,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    };

    // Track modal opens
    const trackModalOpen = (modalType: string) => {
      databaseService.trackEvent('modal_opened', {
        modalType,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    };

    // Add event listeners
    window.addEventListener('load', trackPageLoad);
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    
    // Track button clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      const link = target.closest('a');
      
      if (button) {
        const buttonText = button.textContent?.trim() || 'Unknown Button';
        trackInteraction('button_click', buttonText);
        
        // Special tracking for service buttons
        if (button.dataset.service) {
          trackServiceClick(button.dataset.service);
        }
        
        // Special tracking for modal triggers
        if (button.dataset.modal) {
          trackModalOpen(button.dataset.modal);
        }
      }
      
      if (link) {
        const linkText = link.textContent?.trim() || link.getAttribute('href') || 'Unknown Link';
        trackInteraction('link_click', linkText);
      }
    });

    // Track time spent on page
    const startTime = Date.now();
    const trackTimeSpent = () => {
      const timeSpent = Date.now() - startTime;
      databaseService.trackEvent('time_spent', {
        timeSpent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    };

    window.addEventListener('beforeunload', trackTimeSpent);

    // Cleanup
    return () => {
      window.removeEventListener('load', trackPageLoad);
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('beforeunload', trackTimeSpent);
    };
  }, [enabled]);

  return null; // This component doesn't render anything
};

export default PerformanceTracker;
