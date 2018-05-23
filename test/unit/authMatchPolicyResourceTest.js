/* global describe context it */

'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const authMatchPolicyResource = require('../../src/authMatchPolicyResource');

const expect = chai.expect;
chai.use(dirtyChai);

describe('authMatchPolicyResource', () => {
  context('when resource has no wildcards', () => {
    const resource = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs';
    context('and the resource matches', () => {
      it('returns true', () => {
        expect(
          authMatchPolicyResource(resource, resource)
        ).to.eq(true);
      });
    });
    context('when the resource has one wildcard to match everything', () => {
      const wildcardResource = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/*';
      it('returns true', () => {
        expect(
          authMatchPolicyResource(wildcardResource, resource)
        ).to.eq(true);
      });
    });
    context('when the resource has wildcards', () => {
      const wildcardResource = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/*';
      context('and it matches', () => {
        it('returns true', () => {
          expect(
            authMatchPolicyResource(wildcardResource, resource)
          ).to.eq(true);
        });
      });
      context('and it does not match', () => {
        it('returns false', () => {
          const resource = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/PUT/dinosaurs';

          expect(
            authMatchPolicyResource(wildcardResource, resource)
          ).to.eq(false);
        });
      });
      context('when the resource has multiple wildcards', () => {
        const wildcardResource = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/*/*/stats';

        context('and the wildcard is between two fragments', () => {
          const wildcardResource = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/*/dinosaurs/*';
          context('and it matches', () => {
            it('returns true', () => {
              const resource = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs/stats';

              expect(
                authMatchPolicyResource(wildcardResource, resource)
              ).to.eq(true);
            });
          });
          context('and it does not match', () => {
            it('returns false', () => {
              const resource = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/cats/stats';

              expect(
                authMatchPolicyResource(wildcardResource, resource)
              ).to.eq(false);
            });
          });
        });
        context('and it matches', () => {
          it('returns true', () => {
            const resource = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs/stats';

            expect(
              authMatchPolicyResource(wildcardResource, resource)
            ).to.eq(true);
          });
        });
        context('and it does not match', () => {
          it('returns false', () => {
            const resource = 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/PUT/dinosaurs/xx';

            expect(
              authMatchPolicyResource(wildcardResource, resource)
            ).to.eq(false);
          });
        });
      });
    });
  });
});
