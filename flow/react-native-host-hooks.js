/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/* eslint-disable */

declare module 'deepDiffer' {
  declare function exports(one: any, two: any): bool;
}
declare module 'deepFreezeAndThrowOnMutationInDev' {
  declare function exports<T>(obj : T) : T;
}
declare module 'flattenStyle' { }
declare module 'InitializeCore' { }
declare module 'RCTEventEmitter' {
  declare function register(mixed) : void;
}
declare module 'TextInputState' {
  declare function blurTextInput(object : any) : void;
  declare function focusTextInput(object : any) : void;
}
declare module 'ExceptionsManager' {
  declare function handleException(
    error: Error,
    isFatal: boolean,
  ) : void;
}
declare module 'Platform' {
  declare var OS : string;
}
declare module 'UIManager' {
  declare var customBubblingEventTypes : Object;
  declare var customDirectEventTypes : Object;
  declare function createView(
    reactTag : number,
    viewName : string,
    rootTag : number,
    props : ?Object,
  ) : void;
  declare function manageChildren(
    containerTag : number,
    moveFromIndices : Array<number>,
    moveToIndices : Array<number>,
    addChildReactTags : Array<number>,
    addAtIndices : Array<number>,
    removeAtIndices : Array<number>
  ) : void;
  declare function measure(hostComponent: mixed, callback: Function) : void;
  declare function measureInWindow(
    nativeTag : ?number,
    callback : Function
  ) : void;
  declare function measureLayout(
    nativeTag : mixed,
    nativeNode : number,
    onFail : Function,
    onSuccess : Function
  ) : void;
  declare function removeRootView(containerTag : number) : void;
  declare function removeSubviewsFromContainerWithID(containerId : number) : void;
  declare function replaceExistingNonRootView() : void;
  declare function setChildren(
    containerTag : number,
    reactTags : Array<number>,
  ) : void;
  declare function updateView(
    reactTag : number,
    viewName : string,
    props : ?Object,
  ) : void;
  declare function __takeSnapshot(
    view ?: 'window' | Element<any> | number,
    options ?: {
       width ?: number,
       height ?: number,
       format ?: 'png' | 'jpeg',
       quality ?: number,
    },
  ) : Promise<any>;
}
declare module 'View' {
  declare var exports : typeof React$Component;
}

declare module 'RTManager' {
  declare function createNode(
    tag : number,
    classType : string,
    props : ?Object,
  ) : void;
  declare function appendChildToDetachedParent(
    parentTag : number,
    childTag : number,
  ) : void;

  declare function beginUpdates() : void;

  declare function appendChild(
    parentTag : number,
    childTag : number,
  ) : void;
  declare function prependChild(
    childTag : number,
    beforeTag : number,
  ) : void;
  declare function deleteChild(
    childTag : number,
  ) : void;
  declare function updateNode(
    tag : number,
    props : ?Object,
  ) : void;

  declare function completeUpdates() : void;
}
