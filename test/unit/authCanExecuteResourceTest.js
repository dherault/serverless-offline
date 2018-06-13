/* global describe context it */

'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const authCanExecuteResource = require('../../src/authCanExecuteResource');

const expect = chai.expect;
chai.use(dirtyChai);

describe('authCanExecuteResource', () => {
  context('when the policy has one Statement in an array', () => {
    const setup = (Effect, Resource) => ({
      Statement: [
        {
          Effect,
          Resource,
        },
      ],
    });
    const resource = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs';

    context('when the Resource is in an Allow statement', () => {
      context('and the Resource is an array', () => {
        it('returns true', () => {
          const policy = setup(
            'Allow',
            [resource]
          );

          const canExecute = authCanExecuteResource(policy, resource);
          expect(canExecute).to.eq(true);
        });
      });

      context('and Allow is lowercase', () => {
        it('returns true', () => {
          const policy = setup(
            'allow',
            resource
          );

          const canExecute = authCanExecuteResource(policy, resource);
          expect(canExecute).to.eq(true);
        });
      });

      it('returns true', () => {
        const policy = setup(
          'Allow',
          resource
        );

        const canExecute = authCanExecuteResource(policy, resource);
        expect(canExecute).to.eq(true);
      });
    });

    context('when the Resource is in a Deny statement', () => {
      context('and Resource is an array', () => {
        it('returns true', () => {
          const policy = setup(
            'Deny',
            [resource]
          );

          const canExecute = authCanExecuteResource(policy, resource);
          expect(canExecute).to.eq(false);
        });
      });
      it('returns false', () => {
        const policy = setup(
          'Deny',
          resource
        );

        const canExecute = authCanExecuteResource(policy, resource);
        expect(canExecute).to.eq(false);
      });
    });
  });

  context('when the policy has multiple Statements', () => {
    const setup = statements => (
      {
        Statement: statements.map(statement => ({
          Effect: statement.Effect,
          Resource: statement.Resource,
        })),
      }
    );
    const resourceOne = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs';
    const resourceTwo = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dogs';

    context('when the Resource is in an Allow statement', () => {
      context('and the Resource is an array', () => {
        it('returns true', () => {
          const policy = setup(
            [{
              Effect: 'Allow',
              Resource: [resourceOne],
            },
            {
              Effect: 'Deny',
              Resource: [resourceTwo],
            }]
          );

          const canExecute = authCanExecuteResource(policy, resourceOne);
          expect(canExecute).to.eq(true);
        });
      });

      it('returns true', () => {
        const policy = setup(
          [{
            Effect: 'Allow',
            Resource: resourceOne,
          }],
          [{
            Effect: 'Deny',
            Resource: resourceTwo,
          }]
        );
        const canExecute = authCanExecuteResource(policy, resourceOne);
        expect(canExecute).to.eq(true);
      });
    });

    context('when the resource is in a Deny statement', () => {
      context('and the Resource is an array', () => {
        it('returns true', () => {
          const policy = setup(
            [{
              Effect: 'Allow',
              Resource: [resourceOne],
            },
            {
              Effect: 'Deny',
              Resource: [resourceTwo],
            }]
          );

          const canExecute = authCanExecuteResource(policy, resourceTwo);
          expect(canExecute).to.eq(false);
        });
      });
      it('returns false', () => {
        const policy = setup(
          [{
            Effect: 'Allow',
            Resource: resourceOne,
          }],
          [{
            Effect: 'Deny',
            Resource: resourceTwo,
          }]
        );

        const canExecute = authCanExecuteResource(policy, resourceTwo);
        expect(canExecute).to.eq(false);
      });
    });
  });
});
