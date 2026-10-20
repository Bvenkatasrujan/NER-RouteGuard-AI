import React, { createContext, useContext, useState } from 'react';
import { RouteRequest, RouteOption, RouteOptimizationResponse } from '../types/routing';
import { routingService } from '../services/api/routingService';
import { IncidentReport } from '../types/incident';

interface RouteContextType {
  activeOptions: RouteOption[];
  selectedRoute: RouteOption | null;
  tripStatus: 'AVAILABLE' | 'EN_ROUTE' | 'ON_SITE' | 'COMPLETED';
  hasRouteAlert: boolean;
  alertMessage: string | null;
  optimizeRoute: (req: RouteRequest, incidents: IncidentReport[]) => RouteOptimizationResponse;
  selectRoute: (route: RouteOption) => void;
  startTrip: () => void;
  completeTrip: () => void;
  triggerRouteAlert: (msg: string) => void;
  clearAlert: () => void;
}

const RouteContext = createContext<RouteContextType>({
  activeOptions: [],
  selectedRoute: null,
  tripStatus: 'AVAILABLE',
  hasRouteAlert: false,
  alertMessage: null,
  optimizeRoute: () => ({ recommended_route_id: '', options: [], has_active_hazards: false }),
  selectRoute: () => {},
  startTrip: () => {},
  completeTrip: () => {},
  triggerRouteAlert: () => {},
  clearAlert: () => {},
});

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOptions, setActiveOptions] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [tripStatus, setTripStatus] = useState<'AVAILABLE' | 'EN_ROUTE' | 'ON_SITE' | 'COMPLETED'>('AVAILABLE');
  const [hasRouteAlert, setHasRouteAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const optimizeRoute = (req: RouteRequest, incidents: IncidentReport[]): RouteOptimizationResponse => {
    const res = routingService.calculateRoute(req, incidents);
    setActiveOptions(res.options);
    const recommended = res.options.find((o) => o.route_id === res.recommended_route_id) || res.options[0];
    setSelectedRoute(recommended);
    return res;
  };

  const selectRoute = (route: RouteOption) => {
    setSelectedRoute(route);
  };

  const startTrip = () => {
    setTripStatus('EN_ROUTE');
    setHasRouteAlert(false);
  };

  const completeTrip = () => {
    setTripStatus('COMPLETED');
    setHasRouteAlert(false);
  };

  const triggerRouteAlert = (msg: string) => {
    setHasRouteAlert(true);
    setAlertMessage(msg);
  };

  const clearAlert = () => {
    setHasRouteAlert(false);
    setAlertMessage(null);
  };

  return React.createElement(
    RouteContext.Provider,
    {
      value: {
        activeOptions,
        selectedRoute,
        tripStatus,
        hasRouteAlert,
        alertMessage,
        optimizeRoute,
        selectRoute,
        startTrip,
        completeTrip,
        triggerRouteAlert,
        clearAlert,
      },
    },
    children
  );
};

export const useRoutes = () => useContext(RouteContext);
