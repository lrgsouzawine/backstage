/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentType, RefAttributes, ProviderProps } from 'react';

import { BackstagePlugin } from '../plugin';

/** @public */
export type ComponentRootProviderProps<Props extends {}, Context> = {
  /**
   * A context Provider to use when setting the context value for the _inner_
   * component (or to the extensions down the extension stack).
   */
  ComponentProvider: ComponentType<ProviderProps<Context>>;

  /**
   * A propless opaque component representing the _inner_ component (or a the
   * next extension).
   */
  Component: ComponentType<{}>;

  /**
   * Component props
   * @readonly
   */
  props: Readonly<Props>;
};

/** @public */
export type ComponentProviderProps<Props extends {}, Context> = {
  /**
   * The context value
   */
  value: Context;
} & ComponentRootProviderProps<Props, Context>;

/** @public */
export type ExtendableComponentProps<Props, Context> = {
  /**
   * The component props as provided by the user (potentially modified by props
   * interceptors).
   */
  props: Props;

  /**
   * The context value
   */
  value: Context;
};

/** @public */
export type ExtendableComponentExtraProps<ExtraProps extends {}> = {
  /**
   * Extra props, e.g. `ref` if the component can take a React ref.
   */
  info: ExtraProps;
};

/** @public */
export interface ExtendableComponentRef<
  Props extends {},
  Context,
  ExtraProps extends {} = {},
> {
  /**
   * The 'Provider' part of an extendable component. This component should build
   * up a context object, and forward this to the inner Component using the
   * provided props `ComponentProvider` and `Component`.
   */
  Provider: ComponentType<ComponentRootProviderProps<Props, Context>>;

  /**
   * The inner 'Component' part of an extendable component. This component
   * should render the UI (if any) by using the values of the context, and
   * perhaps also the props.
   */
  Component: ComponentType<
    ExtendableComponentProps<Props, Context> &
      ExtendableComponentExtraProps<ExtraProps>
  >;
}

/**
 * The result of createExtendableComponent(). This object contains a
 * `componentRef` and a `Component` which should both be re-exported with
 * different names.
 *
 * The `componentRef` is used when _extending_ this component, and `Component`
 * is what the users use to render the component.
 *
 * @public
 */
export interface ExtendableComponentDescriptor<
  Props extends {},
  Context,
  ExtraProps extends {} = {},
> {
  componentRef: ExtendableComponentRef<Props, Context>;
  Component: ComponentType<Props & { info: ExtraProps }>;
}

/** @public */
export type RefInfoProps = Pick<RefAttributes<any>, 'ref'>;

/** @public */
export type ExtendableComponentRefConfig<Props, Context> =
  ExtendableComponentRef<Props, Context>;

/** @public */
export type ExtendableComponentRefConfigForwardRef<Props, Context> =
  ExtendableComponentRef<Props, Context, RefInfoProps>;

/**
 * A props interceptor function. It takes props and returns the same props or a
 * new props object of the same type.
 *
 * @public
 */
export type ExtendableComponentPropsInterceptor<Props extends {}> = (
  props: Props,
) => Props;

/**
 * A props interceptor function. It takes props and returns the same props or a
 * new props object of the same type.
 *
 * @public
 */
export type ExtendableComponentProvider<
  Props extends {},
  Context,
> = ComponentType<ComponentProviderProps<Props, Context>>;

/** @public */
export type ExtendableComponentSpec<Props extends {}, Context> = {
  /**
   * Intercept the props, to e.g. rewrite some of them
   */
  interceptProps?: ExtendableComponentPropsInterceptor<Props>;

  /**
   * A provider to intercept the context between
   */
  Provider?: ExtendableComponentProvider<Props, Context>;
};

/**
 * A component extension, consisting of the component ref, and the extension
 * spec ({@link ExtendableComponentSpec}).
 *
 * @public
 */
export type ComponentExtension<Props extends {}, Context> = {
  ref: ExtendableComponentRef<Props, Context>;
  spec: ExtendableComponentSpec<Props, Context>;
  plugin?: BackstagePlugin<any, any>;
};

/**
 * A list of component extensions
 *
 * @public
 */
export type ComponentExtensions = ComponentExtension<any, any>[];
