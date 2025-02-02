import { PermissionAction } from '@supabase/shared-types/out/constants'
import Link from 'next/link'
import { Button, Form, IconBarChart2, Input } from 'ui'

import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import {
  FormActions,
  FormHeader,
  FormPanel,
  FormSection,
  FormSectionContent,
  FormSectionLabel,
} from 'components/ui/Forms'
import Panel from 'components/ui/Panel'
import { GenericSkeletonLoader } from 'components/ui/ShimmeringLoader'
import { useProjectUpdateMutation } from 'data/projects/project-update-mutation'
import { useCheckPermissions, useSelectedOrganization, useStore } from 'hooks'
import PauseProjectButton from './Infrastructure/PauseProjectButton'
import RestartServerButton from './Infrastructure/RestartServerButton'
import { Project } from 'types'

const General = () => {
  const { ui } = useStore()
  const { project } = useProjectContext()
  const organization = useSelectedOrganization()

  const isOrgBilling = !!organization?.subscription_id
  const formId = 'project-general-settings'
  const initialValues = { name: project?.name ?? '', ref: project?.ref ?? '' }
  const canUpdateProject = useCheckPermissions(PermissionAction.UPDATE, 'projects')
  const { mutateAsync: updateProject, isLoading: isUpdating } = useProjectUpdateMutation()

  const onSubmit = async (values: any, { resetForm }: any) => {
    if (!project?.ref) return console.error('Ref is required')
    try {
      const { name } = await updateProject({ ref: project.ref, name: values.name.trim() })
      resetForm({ values: { name }, initialValues: { name } })
      ui.setNotification({ category: 'success', message: 'Successfully saved settings' })
    } catch (error) {}
  }

  return (
    <div>
      <FormHeader title="Project Settings" description="" />
      {project === undefined ? (
        <GenericSkeletonLoader />
      ) : (
        <Form id={formId} initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleReset, values, initialValues }: any) => {
            const hasChanges = JSON.stringify(values) !== JSON.stringify(initialValues)
            return (
              <FormPanel
                disabled={!canUpdateProject}
                footer={
                  <div className="flex py-4 px-8">
                    <FormActions
                      form={formId}
                      isSubmitting={isUpdating}
                      hasChanges={hasChanges}
                      handleReset={handleReset}
                      helper={
                        !canUpdateProject
                          ? "You need additional permissions to manage this project's settings"
                          : undefined
                      }
                    />
                  </div>
                }
              >
                <FormSection header={<FormSectionLabel>General settings</FormSectionLabel>}>
                  <FormSectionContent loading={false}>
                    <Input
                      id="name"
                      size="small"
                      label="Project name"
                      disabled={!canUpdateProject}
                    />
                    <Input copy disabled id="ref" size="small" label="Reference ID" />
                  </FormSectionContent>
                </FormSection>
              </FormPanel>
            )
          }}
        </Form>
      )}
      {isOrgBilling && (
        <>
          <div className="mt-6">
            <FormPanel>
              <div className="flex w-full items-center justify-between px-8 py-4">
                <div>
                  <p className="text-sm">Restart project</p>
                  <div className="max-w-[420px]">
                    <p className="text-sm text-scale-1100">
                      Your project will not be available for a few minutes.
                    </p>
                  </div>
                </div>
                {project && <RestartServerButton />}
              </div>
              <div className="flex w-full items-center justify-between px-8 py-4">
                <div>
                  <p className="text-sm">Pause project</p>
                  <div className="max-w-[420px]">
                    <p className="text-sm text-scale-1100">
                      Your project will not be accessible while it is paused.
                    </p>
                  </div>
                </div>
                {project && <PauseProjectButton />}
              </div>
            </FormPanel>
          </div>
          <div className="mt-6">
            <Panel>
              <Panel.Content>
                <div className="flex justify-between">
                  <div className="flex space-x-4">
                    <IconBarChart2 strokeWidth={2} />
                    <div>
                      <p className="text-sm">Project usage statistics has been moved</p>
                      <p className="text-scale-1000 text-sm">
                        You may view your project's usage under your organization's settings
                      </p>
                    </div>
                  </div>
                  <Link href={`/org/${organization.slug}/usage?projectRef=${project?.ref}`}>
                    <a>
                      <Button type="default">View project usage</Button>
                    </a>
                  </Link>
                </div>
              </Panel.Content>
            </Panel>
          </div>
        </>
      )}
    </div>
  )
}

export default General
