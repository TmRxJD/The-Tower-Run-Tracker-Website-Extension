<template>
  <div :style="appStyle">
    <v-container class="px-4" fluid>
      <v-row>
        <v-col>
          <v-row align="center" no-gutters>
            <v-col :class="$vuetify.display.width >= 625 ? 'mb-2' : ''" :cols="$vuetify.display.width < 625 ? 11 : 'auto'">
              <h1>Username: {{ authStore.username }}</h1>
            </v-col>
            <v-spacer />
            <v-col :class="$vuetify.display.width >= 625 ? 'mb-2' : ''" :cols="$vuetify.display.width < 625 ? 1 : 'auto'">
              <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-btn
                    icon="mdi-cog"
                    variant="text"
                    v-bind="props"
                  />
                </template>
                <v-card min-width="300">
                  <v-card-title>Settings</v-card-title>
                  <v-card-text>
                    <v-select
                      v-model="fontFamily"
                      density="comfortable"
                      :items="fontFamilyOptions"
                      label="Font Family"
                      :loading="savingSettings"
                    />
                    <v-select
                      v-model="fontSize"
                      density="comfortable"
                      :items="fontSizeOptions"
                      label="Font Size"
                      :loading="savingSettings"
                    />
                    <v-select
                      v-model="colorScheme"
                      density="comfortable"
                      item-title="title"
                      item-value="value"
                      :items="colorSchemeOptions"
                      label="Color Scheme"
                      :loading="savingSettings"
                    />
                    <v-divider class="mb-4" />
                    <v-switch
                      v-model="useMobileTableLayout"
                      density="comfortable"
                      label="Use mobile table layout"
                      :loading="savingSettings"
                    />
                    <v-switch
                      v-model="showFullNotes"
                      density="comfortable"
                      label="Show full notes in table"
                      :loading="savingSettings"
                    />
                    <v-switch
                      v-model="sortByRunDateTime"
                      density="comfortable"
                      label="Sort by run date/time"
                      :loading="savingSettings"
                    />
                    <v-switch
                      v-model="isDark"
                      density="comfortable"
                      label="Dark Mode"
                      :loading="savingSettings"
                      @update:model-value="toggleTheme"
                    />
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-col>
            <v-col class="mb-2" cols="auto">
              <v-btn
                color="primary"
                href="https://discord.gg/eqfJMUPEt4"
                target="_blank"
                variant="elevated"
              >
                Try Discord Bot
              </v-btn>
            </v-col>
            <v-col class="mb-2" cols="auto">
              <v-btn
                class="ml-2"
                color="error"
                @click="logout"
              >
                <v-icon start>mdi-logout</v-icon>
                Logout
              </v-btn>
            </v-col>
          </v-row>

          <v-card class="mb-4">
            <v-card-title>Add Run</v-card-title>
            <v-card-text>
              <v-card-title>Upload Screenshot</v-card-title>
              <v-file-input
                v-model="screenshots"
                accept="image/*"
                chips
                label="Select screenshots"
                :loading="processing"
                multiple
                prepend-icon="mdi-camera"
                @change="processScreenshot(screenshots)"
              />
              <v-dialog
                v-model="showOcrPreview"
                max-width="800px"
                persistent
              >
                <v-card>
                  <v-card-title class="d-flex justify-space-between align-center">
                    <span>Review Extracted Data</span>
                    <span
                      v-if="screenshotQueue.length > 1"
                      class="text-caption"
                    >
                      Screenshot {{ currentScreenshotIndex + 1 }} of {{ screenshotQueue.length }}
                    </span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="6">
                        <img
                          class="preview-image mb-4"
                          :src="screenshotPreview"
                          style="cursor: pointer;"
                          @click="showLargePreview = true"
                        >
                      </v-col>
                      <v-col cols="6">
                        <v-form @submit.prevent="saveOcrData">
                          <v-text-field
                            v-model="ocrData.tier"
                            hide-spin-buttons
                            label="Tier"
                            required
                            type="number"
                          />
                          <v-text-field
                            v-model="ocrData.wave"
                            hide-spin-buttons
                            label="Wave"
                            required
                            type="number"
                          />
                          <v-text-field
                            v-model="ocrData.duration"
                            label="Duration (e.g. 1h30m20s)"
                            required
                          />
                          <v-text-field
                            v-model="ocrData.coins"
                            label="Coins (e.g. 100K)"
                            required
                          />
                          <v-text-field
                            v-model="ocrData.cells"
                            label="Cells (e.g. 100K)"
                            required
                          />
                          <v-text-field
                            v-model="ocrData.rerollShards"
                            label="Reroll Shards"
                            required
                          />
                          <v-text-field
                            v-model="ocrData.killedBy"
                            label="Killed By"
                            required
                          />
                          <v-text-field
                            v-model="ocrData.note"
                            label="Note"
                            persistent-placeholder
                            placeholder="Enter any additional notes"
                          />
                          <v-date-input
                            v-model="ocrData.date"
                            :display-format="dateDisplayFormat"
                            label="Date added"
                            prepend-icon=""
                            required
                          />
                          <v-text-field
                            v-model="ocrData.time"
                            label="Time added"
                            required
                            type="time"
                          />
                          <v-date-input
                            v-model="ocrData.runDate"
                            :display-format="dateDisplayFormat"
                            label="Run date"
                            prepend-icon=""
                            required
                          />
                          <v-text-field
                            v-model="ocrData.runTime"
                            label="Run time"
                            required
                            type="time"
                          />
                          <v-select
                            v-model="ocrData.type"
                            item-title="title"
                            item-value="value"
                            :items="runTypeOptions.filter(rt => rt.value !== 'all')"
                            label="Run Type"
                            required
                          />
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer
                      v-if="screenshotQueue.length === 1"
                    />
                    <v-btn
                      color="error"
                      variant="text"
                      @click="cancelOcrReview"
                    >
                      Cancel {{ screenshotQueue.length > 1 ? 'All' : '' }}
                    </v-btn>
                    <v-btn
                      v-if="currentScreenshotIndex + 1 < screenshotQueue.length && screenshotQueue.length > 1"
                      color="warning"
                      variant="text"
                      @click="skipCurrentScreenshot"
                    >
                      Skip
                    </v-btn>
                    <v-spacer v-if="screenshotQueue.length > 1" />
                    <v-btn
                      color="primary"
                      @click="saveOcrData"
                    >
                      Save {{ currentScreenshotIndex + 1 < screenshotQueue.length ? '& Next' : '' }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <div class="text-center mt-4">
                <v-btn
                  color="primary"
                  @click="showManualEntry = true"
                >
                  <v-icon start>mdi-plus</v-icon>
                  Add Run Manually
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <v-dialog
            v-model="showManualEntry"
            max-width="600px"
            persistent
          >
            <v-card>
              <v-card-title>Add Run Manually</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="addManualRun">
                  <v-text-field
                    v-model="manualRun.tier"
                    hide-spin-buttons
                    label="Tier"
                    persistent-placeholder
                    placeholder="Enter tier number"
                    required
                    type="number"
                  />
                  <v-text-field
                    v-model="manualRun.wave"
                    hide-spin-buttons
                    label="Wave"
                    persistent-placeholder
                    placeholder="Enter wave number"
                    required
                    type="number"
                  />
                  <v-text-field
                    v-model="manualRun.duration"
                    label="Duration"
                    persistent-placeholder
                    placeholder="e.g. 1h30m20s"
                    required
                  />
                  <v-text-field
                    v-model="manualRun.coins"
                    label="Coins"
                    persistent-placeholder
                    placeholder="e.g. 100K or 1.5M"
                    required
                  />
                  <v-text-field
                    v-model="manualRun.cells"
                    label="Cells"
                    persistent-placeholder
                    placeholder="e.g. 100K or 1.5M"
                    required
                  />
                  <v-text-field
                    v-model="manualRun.rerollShards"
                    label="Reroll Shards"
                    persistent-placeholder
                    placeholder="Enter number of shards"
                    required
                  />
                  <v-text-field
                    v-model="manualRun.killedBy"
                    label="Killed By"
                    persistent-placeholder
                    placeholder="Enter what killed you"
                    required
                  />
                  <v-text-field
                    v-model="manualRun.note"
                    label="Note"
                    persistent-placeholder
                    placeholder="Enter any additional notes"
                    required
                  />
                  <v-date-input
                    v-model="manualRun.date"
                    :display-format="dateDisplayFormat"
                    label="Date added"
                    prepend-icon=""
                    required
                  />
                  <v-text-field
                    v-model="manualRun.time"
                    label="Time added"
                    required
                    type="time"
                  />
                  <v-date-input
                    v-model="manualRun.runDate"
                    :display-format="dateDisplayFormat"
                    label="Run date"
                    prepend-icon=""
                    required
                  />
                  <v-text-field
                    v-model="manualRun.runTime"
                    label="Run time"
                    required
                    type="time"
                  />
                  <v-select
                    v-model="manualRun.type"
                    item-title="title"
                    item-value="value"
                    :items="runTypeOptions.filter(rt => rt.value !== 'all')"
                    label="Run Type"
                    required
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  variant="text"
                  @click="showManualEntry = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  @click="addManualRun"
                >
                  Add Run
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog
            v-model="showEditDialog"
            max-width="600px"
          >
            <v-card v-if="editingRun">
              <v-card-title>Edit Run</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="updateRun">
                  <v-text-field
                    v-model="editingRun.tier"
                    hide-spin-buttons
                    label="Tier"
                    required
                    type="number"
                  />
                  <v-text-field
                    v-model="editingRun.wave"
                    hide-spin-buttons
                    label="Wave"
                    required
                    type="number"
                  />
                  <v-text-field
                    v-model="editingRun.duration"
                    label="Duration (e.g. 1h30m20s)"
                    required
                  />
                  <v-text-field
                    v-model="editingRun.coins"
                    label="Coins (e.g. 100K)"
                    required
                  />
                  <v-text-field
                    v-model="editingRun.cells"
                    label="Cells (e.g. 100K)"
                    required
                  />
                  <v-text-field
                    v-model="editingRun.rerollShards"
                    label="Reroll Shards"
                    required
                  />
                  <v-text-field
                    v-model="editingRun.killedBy"
                    label="Killed By"
                    required
                  />
                  <v-text-field
                    v-model="editingRun.note"
                    label="Note"
                    persistent-placeholder
                    placeholder="Enter any additional notes"
                    required
                  />
                  <v-date-input
                    v-model="editingRun.date"
                    :display-format="dateDisplayFormat"
                    label="Date added"
                    prepend-icon=""
                    required
                  />
                  <v-text-field
                    v-model="editingRun.time"
                    label="Time added"
                    required
                    type="time"
                  />
                  <v-date-input
                    v-model="editingRun.runDate"
                    :display-format="dateDisplayFormat"
                    label="Run date"
                    prepend-icon=""
                    required
                  />
                  <v-text-field
                    v-model="editingRun.runTime"
                    label="Run time"
                    required
                    type="time"
                  />
                  <v-select
                    v-model="editingRun.type"
                    item-title="title"
                    item-value="value"
                    :items="runTypeOptions.filter(rt => rt.value !== 'all')"
                    label="Run Type"
                    required
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  variant="text"
                  @click="cancelEdit"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  @click="updateRun"
                >
                  Save Changes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-progress-linear
            v-if="loading"
            class="mb-4"
            color="primary"
            indeterminate
          />

          <v-alert
            v-if="error"
            class="mb-4"
            type="error"
          >
            {{ error }}
          </v-alert>

          <v-row no-gutters>
            <v-col class="mb-2" cols="12" md="auto">
              <h2>My Runs</h2>
            </v-col>
            <v-spacer />
            <v-col class="mb-2 pr-2" :cols="$vuetify.display.width < 595 ? 12 : 'auto'">
              <v-btn
                v-if="selectedItems.size"
                color="error"
                :disabled="selectedItems.size === 0"
                max-width="221px"
                @click="deleteSelectedRuns"
              >
                <v-icon start>mdi-delete</v-icon>
                Delete Selected ({{ selectedItems.size }})
              </v-btn>
            </v-col>
            <v-col class="pr-2 mb-2" :cols="$vuetify.display.width < 595 ? 12 : 'auto'">
              <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-btn
                    color="primary"
                    v-bind="props"
                    :width="$vuetify.display.width < 595 ? '221px' : undefined"
                  >
                    Group By
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-checkbox
                      v-model="groupByTier"
                      density="compact"
                      hide-details
                      label="Group by Tier"
                    />
                  </v-list-item>
                  <v-list-item>
                    <v-checkbox
                      v-model="groupByDate"
                      density="compact"
                      hide-details
                      label="Group by Date"
                    />
                  </v-list-item>
                  <v-list-item>
                    <v-checkbox
                      v-model="groupByType"
                      density="compact"
                      hide-details
                      label="Group by Run Type"
                    />
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col class="mb-2" :cols="$vuetify.display.width < 595 ? 12 : 'auto'">
              <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-btn
                    color="primary"
                    v-bind="props"
                    :width="$vuetify.display.width < 595 ? '221px' : undefined"
                  >
                    Customize Columns
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="header in headers"
                    :key="header.key"
                  >
                    <v-checkbox
                      v-model="visibleColumns[header.key]"
                      density="compact"
                      hide-details
                      :label="header.title"
                    />
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col cols="12">
              <v-btn-toggle
                v-model="selectedRunTypes"
                class="mb-4 flex-wrap"
                color="primary"
                mandatory
                multiple
                rounded
                :style="{ minHeight: $vuetify.display.width < 595 ? '96px' : '48px' }"
              >
                <v-btn
                  v-for="(option, index) in runTypeOptions"
                  :key="index"
                  :style="runsButtonStyle(index)"
                  :value="option.value"
                  variant="elevated"
                >
                  {{ option.title }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>

          <v-data-table
            v-if="!loading && !error"
            class="elevation-1 mb-8"
            fixed-header
            :group-by="groupBy"
            :headers="tableHeaders"
            :height="tableHeight"
            :items="itemsFiltered"
            :items-per-page="itemsPerPage"
            :items-per-page-options="itemsPerPageOptions"
            :mobile="$vuetify.display.mobile && useMobileTableLayout"
            :multi-sort="true"
            @update:items-per-page="handleItemsPerPageChange"
          >
            <template #[`header.checkbox`]>
              <v-checkbox
                v-model="selectAll"
                density="compact"
                hide-details
              />
            </template>
            <template #[`item.checkbox`]="{ item }">
              <v-checkbox
                density="compact"
                hide-details
                :model-value="selectedItems.has(item.id)"
                width="20px"
                @update:model-value="(value) => {
                  if (value) {
                    selectedItems.add(item.id)
                  } else {
                    selectedItems.delete(item.id)
                  }
                }"
              />
            </template>
            <template #[`item.note`]="{ item }">
              <v-tooltip
                location="top"
                :text="item.note"
              >
                <template #activator="{ props }">
                  <span v-bind="props">{{ showFullNotes ? item.note : truncateNote(item.note || '') }}</span>
                </template>
              </v-tooltip>
            </template>
            <template #[`item.actions`]="{ item }">
              <div class="d-flex align-center" :class="{'justify-end': $vuetify.display.mobile, 'justify-center': !$vuetify.display.mobile}" style="width: 100%">
                <v-btn
                  v-for="action in item.actions"
                  :key="action.icon"
                  class="mx-1"
                  :color="action.color"
                  density="comfortable"
                  :icon="action.icon"
                  :title="action.title"
                  variant="text"
                  @click="action.onClick"
                />
              </div>
            </template>
          </v-data-table>

          <v-card class="mb-4">
            <v-card-title>
              <v-row align="center" no-gutters>
                <v-col class="mb-2" cols="12" md="auto">
                  <span>Timeline Chart</span>
                </v-col>
                <v-spacer />
                <v-col class="mb-2 mr-2" cols="12" md="auto">
                  <v-switch
                    v-model="groupByTierAverageTable"
                    density="compact"
                    hide-details
                    label="Group by Tier"
                    style="min-width: 60px;"
                  />
                </v-col>
                <v-col class="mb-2 " cols="12" md="auto">
                  <v-menu :close-on-content-click="false">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        class="mr-2"
                        color="primary"
                        min-width="200px"
                      >
                        Customize Y-Axes
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(visible, key) in visibleYAxes"
                        :key="key"
                      >
                        <v-checkbox
                          v-model="visibleYAxes[key]"
                          density="compact"
                          hide-details
                          :label="getYAxisLabel(key)"
                        />
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
                <v-col class="mb-2" cols="12" md="auto">
                  <v-menu :close-on-content-click="false">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        class="mr-2"
                        color="primary"
                        min-width="200px"
                      >
                        Customize Timeline
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="header in timelineHeaders"
                        :key="header.key"
                      >
                        <v-checkbox
                          v-model="visibleTimelineColumns[header.key]"
                          density="compact"
                          hide-details
                          :label="header.title"
                        />
                      </v-list-item>
                      <v-divider class="my-2" />
                      <v-list-item>
                        <v-checkbox
                          v-model="showAllTiers"
                          density="compact"
                          hide-details
                          label="Show All Tiers"
                          @update:model-value="toggleAllTiers"
                        />
                      </v-list-item>
                      <v-list-item
                        v-for="tier in availableTiers"
                        :key="tier"
                      >
                        <v-checkbox
                          v-model="visibleTiers[tier]"
                          density="compact"
                          hide-details
                          :label="`Tier ${tier}`"
                        />
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
                <v-col class="mb-2" cols="12" md="auto">
                  <v-menu :close-on-content-click="false">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        class="mr-2"
                        color="primary"
                        min-width="200px"
                      >
                        Customize Style
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-row>
                          <v-col cols="6">
                            Line Types
                          </v-col>
                          <v-col cols="6">
                            Line Colors
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col cols="6">
                            <v-select
                              v-model="lineTypes.wave"
                              density="compact"
                              hide-details
                              item-title="title"
                              item-value="value"
                              :items="lineTypeOptions"
                              label="Wave"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-menu>
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  class="w-100"
                                  :style="{ backgroundColor: lineColors.wave }"
                                  variant="elevated"
                                >
                                  Wave
                                </v-btn>
                              </template>
                              <v-color-picker
                                v-model="lineColors.wave"
                                hide-inputs
                                mode="hex"
                                @click.stop.prevent
                                @update:model-value="saveTimelineSettings"
                              />
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col cols="6">
                            <v-select
                              v-model="lineTypes.coins"
                              density="compact"
                              hide-details
                              item-title="title"
                              item-value="value"
                              :items="lineTypeOptions"
                              label="Coins"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-menu>
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  class="w-100"
                                  :style="{ backgroundColor: lineColors.coins }"
                                  variant="elevated"
                                >
                                  Coins
                                </v-btn>
                              </template>
                              <v-color-picker
                                v-model="lineColors.coins"
                                hide-inputs
                                mode="hex"
                                @click.stop.prevent
                                @update:model-value="saveTimelineSettings"
                              />
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col cols="6">
                            <v-select
                              v-model="lineTypes.cells"
                              density="compact"
                              hide-details
                              item-title="title"
                              item-value="value"
                              :items="lineTypeOptions"
                              label="Cells"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-menu>
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  class="w-100"
                                  :style="{ backgroundColor: lineColors.cells }"
                                  variant="elevated"
                                >
                                  Cells
                                </v-btn>
                              </template>
                              <v-color-picker
                                v-model="lineColors.cells"
                                hide-inputs
                                mode="hex"
                                @click.stop.prevent
                                @update:model-value="saveTimelineSettings"
                              />
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col cols="6">
                            <v-select
                              v-model="lineTypes.rerollShards"
                              density="compact"
                              hide-details
                              item-title="title"
                              item-value="value"
                              :items="lineTypeOptions"
                              label="Reroll Shards"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-menu>
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  class="w-100"
                                  :style="{ backgroundColor: lineColors.rerollShards }"
                                  variant="elevated"
                                >
                                  Reroll Shards
                                </v-btn>
                              </template>
                              <v-color-picker
                                v-model="lineColors.rerollShards"
                                hide-inputs
                                mode="hex"
                                @click.stop.prevent
                                @update:model-value="saveTimelineSettings"
                              />
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col cols="6">
                            <v-select
                              v-model="lineTypes.coinsPerHour"
                              density="compact"
                              hide-details
                              item-title="title"
                              item-value="value"
                              :items="lineTypeOptions"
                              label="Coins/Hour"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-menu>
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  class="w-100"
                                  :style="{ backgroundColor: lineColors.coinsPerHour }"
                                  variant="elevated"
                                >
                                  Coins/Hour
                                </v-btn>
                              </template>
                              <v-color-picker
                                v-model="lineColors.coinsPerHour"
                                hide-inputs
                                mode="hex"
                                @click.stop.prevent
                                @update:model-value="saveTimelineSettings"
                              />
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col cols="6">
                            <v-select
                              v-model="lineTypes.cellsPerHour"
                              density="compact"
                              hide-details
                              item-title="title"
                              item-value="value"
                              :items="lineTypeOptions"
                              label="Cells/Hour"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-menu>
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  class="w-100"
                                  :style="{ backgroundColor: lineColors.cellsPerHour }"
                                  variant="elevated"
                                >
                                  Cells/Hour
                                </v-btn>
                              </template>
                              <v-color-picker
                                v-model="lineColors.cellsPerHour"
                                hide-inputs
                                mode="hex"
                                @click.stop.prevent
                                @update:model-value="saveTimelineSettings"
                              />
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col cols="6">
                            <v-select
                              v-model="lineTypes.rerollShardsPerHour"
                              density="compact"
                              hide-details
                              item-title="title"
                              item-value="value"
                              :items="lineTypeOptions"
                              label="Reroll Shards/Hour"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-menu>
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  block
                                  class="w-100 px-8"
                                  :style="{ backgroundColor: lineColors.rerollShardsPerHour }"
                                >
                                  Reroll Shards/H
                                </v-btn>
                              </template>
                              <v-color-picker
                                v-model="lineColors.rerollShardsPerHour"
                                hide-inputs
                                mode="hex"
                                @click.stop.prevent
                                @update:model-value="saveTimelineSettings"
                              />
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col cols="6">
                            <v-select
                              v-model="lineTypes.wavesPerHour"
                              density="compact"
                              hide-details
                              item-title="title"
                              item-value="value"
                              :items="lineTypeOptions"
                              label="Waves/Hour"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-menu>
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  class="w-100"
                                  :style="{ backgroundColor: lineColors.wavesPerHour }"
                                  variant="elevated"
                                >
                                  Waves/Hour
                                </v-btn>
                              </template>
                              <v-color-picker
                                v-model="lineColors.wavesPerHour"
                                hide-inputs
                                mode="hex"
                                @click.stop.prevent
                                @update:model-value="saveTimelineSettings"
                              />
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-slider
                          v-model="dotSize"
                          class="pt-7 pb-2"
                          density="compact"
                          hide-details
                          label="Dot Size"
                          :max="dotSizeMax"
                          :min="dotSizeMin"
                          :step="dotSizeStep"
                          thumb-label
                        />
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
                <v-col
                  class="mb-2"
                  cols="12"
                  md="auto"
                >
                  <v-btn
                    color="primary"
                    min-width="200px"
                    @click="showFullscreenChart = true"
                  >
                    <v-icon start>mdi-fullscreen</v-icon>
                    Fullscreen
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <div :style="{ height: '400px' }">
                <Line
                  :data="timelineChartData"
                  :options="timelineChartOptions"
                />
              </div>
            </v-card-text>
          </v-card>

          <v-dialog
            v-model="showFullscreenChart"
            fullscreen
            :scrim="false"
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar color="primary" height="160px">
                <v-row align="center" justify="space-between" no-gutters>
                  <v-col class="ml-4 mt-2 mt-md-0" cols="6" md="auto" order="1">
                    <v-toolbar-title>Timeline Chart</v-toolbar-title>
                  </v-col>
                  <v-col class="ml-6" cols="12" md="auto" order="3">
                    <v-switch
                      v-model="groupByTierAverageTable"
                      density="compact"
                      hide-details
                      label="Group by Tier"
                    />
                  </v-col>
                  <v-col cols="12" md="auto" order="3">
                    <v-menu :close-on-content-click="false">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          class="mr-2"
                          color="white"
                        >
                          Customize Y-Axes
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="(visible, key) in visibleYAxes"
                          :key="key"
                        >
                          <v-checkbox
                            v-model="visibleYAxes[key]"
                            density="compact"
                            hide-details
                            :label="getYAxisLabel(key)"
                          />
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="auto" order="4">
                    <v-menu :close-on-content-click="false">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          class="mr-2"
                          color="white"
                        >
                          Customize Timeline
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="header in timelineHeaders"
                          :key="header.key"
                        >
                          <v-checkbox
                            v-model="visibleTimelineColumns[header.key]"
                            density="compact"
                            hide-details
                            :label="header.title"
                          />
                        </v-list-item>
                        <v-divider class="my-2" />
                        <v-list-item>
                          <v-checkbox
                            v-model="showAllTiers"
                            density="compact"
                            hide-details
                            label="Show All Tiers"
                            @update:model-value="toggleAllTiers"
                          />
                        </v-list-item>
                        <v-list-item
                          v-for="tier in availableTiers"
                          :key="tier"
                        >
                          <v-checkbox
                            v-model="visibleTiers[tier]"
                            density="compact"
                            hide-details
                            :label="`Tier ${tier}`"
                          />
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="auto" order="5">
                    <v-menu :close-on-content-click="false">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          class="mr-2"
                          color="white"
                        >
                          Customize Style
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item>
                          <v-row>
                            <v-col cols="6">
                              Line Types
                            </v-col>
                            <v-col cols="6">
                              Line Colors
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <v-list-item>
                          <v-row>
                            <v-col cols="6">
                              <v-select
                                v-model="lineTypes.wave"
                                density="compact"
                                hide-details
                                item-title="title"
                                item-value="value"
                                :items="lineTypeOptions"
                                label="Wave"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-menu>
                                <template #activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    class="w-100"
                                    :style="{ backgroundColor: lineColors.wave }"
                                    variant="elevated"
                                  >
                                    Wave
                                  </v-btn>
                                </template>
                                <v-color-picker
                                  v-model="lineColors.wave"
                                  hide-inputs
                                  mode="hex"
                                  @click.stop.prevent
                                  @update:model-value="saveTimelineSettings"
                                />
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <v-list-item>
                          <v-row>
                            <v-col cols="6">
                              <v-select
                                v-model="lineTypes.coins"
                                density="compact"
                                hide-details
                                item-title="title"
                                item-value="value"
                                :items="lineTypeOptions"
                                label="Coins"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-menu>
                                <template #activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    class="w-100"
                                    :style="{ backgroundColor: lineColors.coins }"
                                    variant="elevated"
                                  >
                                    Coins
                                  </v-btn>
                                </template>
                                <v-color-picker
                                  v-model="lineColors.coins"
                                  hide-inputs
                                  mode="hex"
                                  @click.stop.prevent
                                  @update:model-value="saveTimelineSettings"
                                />
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <v-list-item>
                          <v-row>
                            <v-col cols="6">
                              <v-select
                                v-model="lineTypes.cells"
                                density="compact"
                                hide-details
                                item-title="title"
                                item-value="value"
                                :items="lineTypeOptions"
                                label="Cells"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-menu>
                                <template #activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    class="w-100"
                                    :style="{ backgroundColor: lineColors.cells }"
                                    variant="elevated"
                                  >
                                    Cells
                                  </v-btn>
                                </template>
                                <v-color-picker
                                  v-model="lineColors.cells"
                                  hide-inputs
                                  mode="hex"
                                  @click.stop.prevent
                                  @update:model-value="saveTimelineSettings"
                                />
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <v-list-item>
                          <v-row>
                            <v-col cols="6">
                              <v-select
                                v-model="lineTypes.rerollShards"
                                density="compact"
                                hide-details
                                item-title="title"
                                item-value="value"
                                :items="lineTypeOptions"
                                label="Reroll Shards"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-menu>
                                <template #activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    class="w-100"
                                    :style="{ backgroundColor: lineColors.rerollShards }"
                                    variant="elevated"
                                  >
                                    Reroll Shards
                                  </v-btn>
                                </template>
                                <v-color-picker
                                  v-model="lineColors.rerollShards"
                                  hide-inputs
                                  mode="hex"
                                  @click.stop.prevent
                                  @update:model-value="saveTimelineSettings"
                                />
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <v-list-item>
                          <v-row>
                            <v-col cols="6">
                              <v-select
                                v-model="lineTypes.coinsPerHour"
                                density="compact"
                                hide-details
                                item-title="title"
                                item-value="value"
                                :items="lineTypeOptions"
                                label="Coins/Hour"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-menu>
                                <template #activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    class="w-100"
                                    :style="{ backgroundColor: lineColors.coinsPerHour }"
                                    variant="elevated"
                                  >
                                    Coins/Hour
                                  </v-btn>
                                </template>
                                <v-color-picker
                                  v-model="lineColors.coinsPerHour"
                                  hide-inputs
                                  mode="hex"
                                  @click.stop.prevent
                                  @update:model-value="saveTimelineSettings"
                                />
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <v-list-item>
                          <v-row>
                            <v-col cols="6">
                              <v-select
                                v-model="lineTypes.cellsPerHour"
                                density="compact"
                                hide-details
                                item-title="title"
                                item-value="value"
                                :items="lineTypeOptions"
                                label="Cells/Hour"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-menu>
                                <template #activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    class="w-100"
                                    :style="{ backgroundColor: lineColors.cellsPerHour }"
                                    variant="elevated"
                                  >
                                    Cells/Hour
                                  </v-btn>
                                </template>
                                <v-color-picker
                                  v-model="lineColors.cellsPerHour"
                                  hide-inputs
                                  mode="hex"
                                  @click.stop.prevent
                                  @update:model-value="saveTimelineSettings"
                                />
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <v-list-item>
                          <v-row>
                            <v-col cols="6">
                              <v-select
                                v-model="lineTypes.rerollShardsPerHour"
                                density="compact"
                                hide-details
                                item-title="title"
                                item-value="value"
                                :items="lineTypeOptions"
                                label="Reroll Shards/Hour"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-menu>
                                <template #activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    class="w-100 px-8"
                                    :style="{ backgroundColor: lineColors.rerollShardsPerHour }"
                                    variant="elevated"
                                  >
                                    Reroll Shards/H
                                  </v-btn>
                                </template>
                                <v-color-picker
                                  v-model="lineColors.rerollShardsPerHour"
                                  hide-inputs
                                  mode="hex"
                                  @click.stop.prevent
                                  @update:model-value="saveTimelineSettings"
                                />
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <v-list-item>
                          <v-row>
                            <v-col cols="6">
                              <v-select
                                v-model="lineTypes.wavesPerHour"
                                density="compact"
                                hide-details
                                item-title="title"
                                item-value="value"
                                :items="lineTypeOptions"
                                label="Waves/Hour"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-menu>
                                <template #activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    class="w-100"
                                    :style="{ backgroundColor: lineColors.wavesPerHour }"
                                    variant="elevated"
                                  >
                                    Waves/Hour
                                  </v-btn>
                                </template>
                                <v-color-picker
                                  v-model="lineColors.wavesPerHour"
                                  hide-inputs
                                  mode="hex"
                                  @click.stop.prevent
                                  @update:model-value="saveTimelineSettings"
                                />
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <v-list-item>
                          <v-slider
                            v-model="dotSize"
                            class="pt-7 pb-2"
                            density="compact"
                            hide-details
                            label="Dot Size"
                            :max="dotSizeMax"
                            :min="dotSizeMin"
                            :step="dotSizeStep"
                            thumb-label
                          />
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                  <v-col cols="auto" order="2" order-md="6">
                    <v-btn
                      dark
                      icon
                      @click="showFullscreenChart = false"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-toolbar>
              <v-card-text class="pa-0">
                <div style="height: calc(100vh - 160px)">
                  <Line
                    :data="timelineChartData"
                    :options="timelineChartOptions"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-row
            align="center"
            no-gutters
          >
            <v-col
              class="mb-2"
              cols="12"
              sm="auto"
            >
              <h2>Average Statistics per Tier</h2>
            </v-col>
            <v-spacer />
            <v-col class="mb-2" cols="auto">
              <v-text-field
                v-model="averageFromDate"
                class="mr-2"
                density="compact"
                hide-details
                label="From"
                max-width="150px"
                min-width="150px"
                style="min-width: 150px;"
                type="date"
              />
            </v-col>
            <v-col class="mb-2 mr-2" cols="auto">
              <v-text-field
                v-model="averageToDate"
                density="compact"
                hide-details
                label="To"
                max-width="150px"
                min-width="150px"
                type="date"
              />
            </v-col>
            <v-col class="mb-2" cols="12" sm="auto">
              <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-btn
                    color="primary"
                    v-bind="props"
                  >
                    Customize Columns
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="header in averageHeaders"
                    :key="header.key"
                  >
                    <v-checkbox
                      v-model="visibleAverageColumns[header.key]"
                      density="compact"
                      hide-details
                      :label="header.title"
                    />
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>

          <v-data-table
            v-if="!loading && !error"
            class="elevation-1"
            fixed-header
            :headers="visibleAverageHeaders"
            :height="averatePerTiertableHeight"
            :items="averageStats"
            :items-per-page="averageItemsPerPage"
            :items-per-page-options="itemsPerPageOptions"
            :mobile="$vuetify.display.mobile && useMobileTableLayout"
            multi-sort
            @update:items-per-page="handleAverageItemsPerPageChange"
          />

          <v-dialog
            v-model="showLargePreview"
            class="image-preview-dialog"
            max-width="800px"
            scrollable
            @click:outside="showLargePreview = false"
          >
            <v-card class="pa-0">
              <img
                class="large-preview-image"
                :src="screenshotPreview"
                @click="showLargePreview = false"
              >
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { useDate, useDisplay, useTheme } from 'vuetify'
  import { Line } from 'vue-chartjs'
  import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js'
  import type { TooltipItem } from 'chart.js'
  import { useAuthStore } from '@/stores/auth'
  import axios from 'axios'
  import { notify } from '@kyvg/vue3-notification'
  import type { ColumnVisibility, MetricKey, Run, RunData, RunDatabase, TimelineColumnVisibility, TimelineDataset, YAxisVisibility } from '@/types/user-runs.types'
  import { handleError, normalizeNumericValue, parseDuration, parseValueWithUnit, roundNumber, saveSettings, showSuccess, STORAGE_KEYS } from '@/utils/user-runs.utils'
  import { defaultVisibleAverageColumns, defaultVisibleColumns, defaultVisibleTimelineColumns, defaultYAxisVisibility, itemsPerPageOptions, runTypeOptions, tierColors, timelineHeaders } from '@/config/defaults'
  import { Account, Databases, ID, Query } from 'appwrite'
  import client from '@/plugins/appwrite'
  import type { SortItem } from 'vuetify/lib/components/VDataTable/composables/sort.mjs'
  import type { ChartEvent } from 'chart.js'
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  const authStore = useAuthStore()

  const databases = new Databases(client)

  const dateAdapter = useDate()

  const createDefaultRun = () => {
    const date = shallowRef(dateAdapter.parseISO(new Date().toISOString()) as Date)
    const runDate = shallowRef(dateAdapter.parseISO(new Date().toISOString()) as Date)
    return {
      tier: '',
      wave: '',
      duration: '',
      coins: '',
      cells: '',
      rerollShards: '',
      killedBy: '',
      note: '',
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'Farming',
      runDate,
      runTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }
  }

  // #region Variables
  const theme = useTheme()
  const display = useDisplay()
  const fontFamily = ref('Roboto')
  const fontSize = ref('14px')
  const showFullNotes = ref(false)
  const sortByRunDateTime = ref(true)
  const colorScheme = ref('default')
  const isDark = ref(true)
  const useMobileTableLayout = ref(false)
  const screenshots = ref<File[] | null>(null)
  const screenshotQueue = ref<File[]>([])
  const currentScreenshotIndex = ref(0)
  const processing = ref(false)
  const showManualEntry = ref(false)
  const savingSettings = ref(false)
  const manualRun = ref(createDefaultRun())
  const showOcrPreview = ref(false)
  const screenshotPreview = ref('')
  const ocrData = ref(createDefaultRun())
  const loading = ref(true)
  const error = ref('')
  const items = ref<RunDatabase[]>([])
  const selectedRunTypes = ref<string[]>(runTypeOptions.map(option => option.value))
  const showLargePreview = ref(false)
  const averageFromDate = ref(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const averageToDate = ref(new Date().toISOString().split('T')[0])
  const editingRun = ref<Run | null>(null)
  const showEditDialog = ref(false)
  const visibleColumns = ref<ColumnVisibility>(defaultVisibleColumns)
  const visibleAverageColumns = ref<ColumnVisibility>(defaultVisibleAverageColumns)
  const itemsPerPage = ref(10)
  const averageItemsPerPage = ref(10)
  const visibleTimelineColumns = ref<TimelineColumnVisibility>(defaultVisibleTimelineColumns)
  let areVisibleTimelineColumnsDefault = true
  const groupByTierAverageTable = ref(false)
  const groupByTier = ref(false)
  const groupByDate = ref(false)
  const groupByType = ref(false)
  const showAllTiers = ref(true)
  const visibleTiers = ref<Record<string, boolean>>({})
  const visibleYAxes = ref<YAxisVisibility>(defaultYAxisVisibility)
  let areVisibleYAxesDefault = true
  const showFullscreenChart = ref(false)
  let dontChangeSelectedRunTypes = false
  const dotSize = ref(5)
  const lineTypes = ref<Record<string, string>>({
    wave: 'solid',
    coins: 'solid',
    cells: 'solid',
    rerollShards: 'solid',
    coinsPerHour: 'solid',
    cellsPerHour: 'solid',
    rerollShardsPerHour: 'solid',
    wavesPerHour: 'solid',
  })
  const lineColors = ref<Record<string, string>>({
    wave: '#1976d2',
    coins: '#4caf50',
    cells: '#ff9800',
    rerollShards: '#9c27b0',
    coinsPerHour: '#2196f3',
    cellsPerHour: '#ff5722',
    rerollShardsPerHour: '#607d8b',
    wavesPerHour: '#795548',
  })
  const lineTypeOptions = [
    { title: 'Solid', value: 'solid' },
    { title: 'Dashed', value: 'dashed' },
    { title: 'Dotted', value: 'dotted' },
    { title: 'Long Dashed', value: 'long-dashed' },
    { title: 'Short Dashed', value: 'short-dashed' },
    { title: 'Dash-Dot', value: 'dash-dot' },
    { title: 'Dash-Dot-Dot', value: 'dash-dot-dot' },
    { title: 'Long Dash-Short Dash', value: 'long-short-dash' },
  ]
  const dotSizeMin = 1
  const dotSizeMax = 10
  const dotSizeStep = 0.5
  const fontFamilyOptions = [
    'Roboto',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Open Sans',
  ]
  const fontSizeOptions = [
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
  ]
  const colorSchemeOptions = [
    { title: 'Default', value: 'default' },
    { title: 'Midnight Purple', value: 'midnight-purple' },
    { title: 'Forest Green', value: 'forest-green' },
    { title: 'Sunset', value: 'sunset' },
    { title: 'Ocean', value: 'ocean' },
  ]

  const sortByUnit = (a: string, b: string) => {
    const aValue = parseValueWithUnit(a)
    const bValue = parseValueWithUnit(b)
    const unitMultipliers: Record<string, number> = {
      '': 1,
      'K': 1e3,
      'M': 1e6,
      'B': 1e9,
      'T': 1e12,
      'q': 1e15,
      's': 1e18,
    }
    const aMultiplier = unitMultipliers[aValue.unit] || 1
    const bMultiplier = unitMultipliers[bValue.unit] || 1
    return (aValue.value * aMultiplier) - (bValue.value * bMultiplier)
  }

  type Align = 'center' | 'end' | 'start' | undefined
  const headers = [
    { title: 'Select', key: 'checkbox', sortable: false, align: 'center' as Align },
    { title: '#', key: 'ordinal' },
    { title: 'Tier', key: 'tier' },
    { title: 'Wave', key: 'wave' },
    { title: 'Duration', key: 'duration' },
    { title: 'Coins', key: 'coins', sort: sortByUnit },
    { title: 'Cells', key: 'cells', sort: sortByUnit },
    { title: 'Reroll shards', key: 'rerollShards', sort: sortByUnit },
    { title: 'Killed By', key: 'killedBy' },
    { title: 'Coins/Hour', key: 'coinsPerHour', sort: sortByUnit },
    { title: 'Cells/Hour', key: 'cellsPerHour', sort: sortByUnit },
    { title: 'Reroll Shards/Hour', key: 'rerollShardsPerHour', sort: sortByUnit },
    { title: 'Waves/Hour', key: 'wavesPerHour' },
    { title: 'Type', key: 'type' },
    { title: 'Date added', key: 'date' },
    { title: 'Time added', key: 'time' },
    { title: 'Run date', key: 'runDate' },
    { title: 'Run time', key: 'runTime' },
    { title: 'Note', key: 'note' },
    { title: 'Actions', key: 'actions', sortable: false, align: 'center' as Align },
  ]

  const averageHeaders = [
    { title: 'Tier', key: 'tier' },
    { title: 'Average Wave', key: 'averageWave' },
    { title: 'Average Duration', key: 'averageDuration' },
    { title: 'Average Coins', key: 'averageCoins', sort: sortByUnit },
    { title: 'Average Cells', key: 'averageCells', sort: sortByUnit },
    { title: 'Average Reroll Shards', key: 'averageRerollShards', sort: sortByUnit },
    { title: 'Average Coins/Hour', key: 'averageCoinsPerHour', sort: sortByUnit },
    { title: 'Average Cells/Hour', key: 'averageCellsPerHour', sort: sortByUnit },
    { title: 'Average Reroll Shards/Hour', key: 'averageRerollShardsPerHour', sort: sortByUnit },
    { title: 'Average Waves/Hour', key: 'averageWavesPerHour' },
    { title: 'Total Runs', key: 'totalRuns' },
  ]
  // #endregion Variables

  // #region Computed properties
  const tableHeight = computed(() => {
    let itemsPerPageNumber = itemsPerPage.value
    const itemsFilteredNumber = itemsFiltered.value.length
    if (itemsPerPageNumber === -1) {
      itemsPerPageNumber = itemsFilteredNumber + 1
    }

    let numberOfRows
    if (itemsPerPageNumber < itemsFilteredNumber) {
      numberOfRows = itemsPerPageNumber
    } else {
      numberOfRows = itemsFilteredNumber
    }

    const isMobileView = display.mobile.value && useMobileTableLayout.value
    if (numberOfRows <= 17 && !isMobileView) {
      return `${62 + numberOfRows * 52}px`
    }
    return 'calc(100vh - 240px)'
  })

  const averatePerTiertableHeight = computed(() => {
    let itemsPerPageNumber = averageItemsPerPage.value
    const itemsFilteredNumber = averageStats.value.length
    if (itemsPerPageNumber === -1) {
      itemsPerPageNumber = itemsFilteredNumber + 1
    }

    let numberOfRows
    if (itemsPerPageNumber < itemsFilteredNumber) {
      numberOfRows = itemsPerPageNumber
    } else {
      numberOfRows = itemsFilteredNumber
    }

    const isMobileView = display.mobile.value && useMobileTableLayout.value
    if (numberOfRows <= 17 && !isMobileView) {
      return `${63 + numberOfRows * 52}px`
    }
    return 'calc(100vh - 240px)'
  })

  const itemsParsed = computed(() => {
    return items.value
      .map(run => {
        const durationInSeconds = parseDuration(run.duration)
        const durationInHours = durationInSeconds / 3600
        const { value: coinsValue, unit: coinsUnit } = parseValueWithUnit(run.coins)
        const { value: cellsValue, unit: cellsUnit } = parseValueWithUnit(run.cells)
        const { value: rerollShardsValue, unit: rerollShardsUnit } = parseValueWithUnit(run.rerollShards)
        const wavesValue = parseInt(run.wave)

        return {
          ...run,
          coins: `${coinsValue}${coinsUnit}`,
          cells: `${cellsValue}${cellsUnit}`,
          rerollShards: `${rerollShardsValue}${rerollShardsUnit}`,
          coinsPerHour: `${roundNumber(coinsValue / durationInHours)}${coinsUnit}`,
          cellsPerHour: `${roundNumber(cellsValue / durationInHours)}${cellsUnit}`,
          rerollShardsPerHour: `${roundNumber(rerollShardsValue / durationInHours)}${rerollShardsUnit}`,
          wavesPerHour: `${roundNumber(wavesValue / durationInHours)}`,
          actions: [
            {
              icon: 'mdi-pencil',
              color: 'primary',
              title: 'Edit Run',
              onClick: () => editRun(run),
            },
            {
              icon: 'mdi-delete',
              color: 'error',
              title: 'Delete Run',
              onClick: () => deleteRun(run.id),
            },
          ],
        }
      })
      .sort((a, b) => {
        if (sortByRunDateTime.value) {
          const dateCompare = b.runDate.localeCompare(a.runDate)
          if (dateCompare !== 0) return dateCompare
          return b.runTime.localeCompare(a.runTime)
        } else {
          const dateCompare = b.date.localeCompare(a.date)
          if (dateCompare !== 0) return dateCompare
          return b.time.localeCompare(a.time)
        }
      })
      .map((run, index, array) => {
        return {
          ...run,
          ordinal: array.length - index,
        }
      })
  })

  const availableTiers = computed(() => {
    const tiers = new Set<string>()
    itemsParsed.value.forEach(run => {
      tiers.add(run.tier)
    })
    return Array.from(tiers).sort((a, b) => parseInt(b) - parseInt(a))
  })

  const averageStats = computed(() => {
    const tierStats = new Map<string, {
      totalWave: number
      totalDuration: number
      totalCoins: number
      totalCells: number
      totalRerollShards: number
      totalCoinsPerHour: number
      totalCellsPerHour: number
      totalRerollShardsPerHour: number
      totalWavesPerHour: number
      count: number
      coinsValues: { value: number; unit: string }[]
      cellsValues: { value: number; unit: string }[]
      rerollShardsValues: { value: number; unit: string }[]
    }>()

    const filteredRuns = itemsParsed.value.filter(run => {
      const runDate = new Date(`${run.date}T${run.time}`)
      const fromDate = new Date()
      const [yearAverageFromDate, monthAverageFromDate, dayAverageFromDate] = averageFromDate.value.split('-')
      fromDate.setDate(parseInt(dayAverageFromDate))
      fromDate.setMonth(parseInt(monthAverageFromDate) - 1)
      fromDate.setFullYear(parseInt(yearAverageFromDate))
      fromDate.setHours(0, 0, 0, 0)
      const toDate = new Date()
      const [yearAverageToDate, monthAverageToDate, dayAverageToDate] = averageToDate.value.split('-')
      toDate.setDate(parseInt(dayAverageToDate))
      toDate.setMonth(parseInt(monthAverageToDate) - 1)
      toDate.setFullYear(parseInt(yearAverageToDate))
      toDate.setHours(23, 59, 59, 999)
      return runDate >= fromDate && runDate <= toDate
    }).filter(run => selectedRunTypes.value.includes('all') || selectedRunTypes.value.includes(run.type ?? ''))

    filteredRuns.forEach(run => {
      const stats = tierStats.get(run.tier) || {
        totalWave: 0,
        totalDuration: 0,
        totalCoins: 0,
        totalCells: 0,
        totalRerollShards: 0,
        totalCoinsPerHour: 0,
        totalCellsPerHour: 0,
        totalRerollShardsPerHour: 0,
        totalWavesPerHour: 0,
        count: 0,
        coinsValues: [],
        cellsValues: [],
        rerollShardsValues: [],
      }

      const durationInSeconds = parseDuration(run.duration)
      const durationInHours = durationInSeconds / 3600
      const coinsData = parseValueWithUnit(run.coins)
      const cellsData = parseValueWithUnit(run.cells)
      const rerollShardsData = parseValueWithUnit(run.rerollShards)
      const wavesValue = parseInt(run.wave)

      stats.totalWave += wavesValue
      stats.totalDuration += durationInSeconds
      stats.totalCoins += coinsData.value
      stats.totalCells += cellsData.value
      stats.totalRerollShards += rerollShardsData.value
      stats.totalCoinsPerHour += coinsData.value / durationInHours
      stats.totalCellsPerHour += cellsData.value / durationInHours
      stats.totalRerollShardsPerHour += rerollShardsData.value / durationInHours
      stats.totalWavesPerHour += wavesValue / durationInHours
      stats.count++
      stats.coinsValues.push(coinsData)
      stats.cellsValues.push(cellsData)
      stats.rerollShardsValues.push(rerollShardsData)

      tierStats.set(run.tier, stats)
    })

    return Array.from(tierStats.entries())
      .map(([tier, stats]) => {
        const averageDurationInSeconds = stats.totalDuration / stats.count
        const hours = Math.floor(averageDurationInSeconds / 3600)
        const minutes = Math.floor((averageDurationInSeconds % 3600) / 60)
        const seconds = Math.floor(averageDurationInSeconds % 60)
        const averageDuration = `${hours}h${minutes}m${seconds}s`

        const normalizedCoins = normalizeUnits(stats.coinsValues)
        const normalizedCells = normalizeUnits(stats.cellsValues)
        const normalizedRerollShards = normalizeUnits(stats.rerollShardsValues)

        const averageCoinsValue = normalizedCoins.reduce((sum, { value }) => sum + value, 0) / stats.count
        const averageCellsValue = normalizedCells.reduce((sum, { value }) => sum + value, 0) / stats.count
        const averageRerollShardsValue = normalizedRerollShards.reduce((sum, { value }) => sum + value, 0) / stats.count

        return {
          tier,
          averageWave: roundNumber(stats.totalWave / stats.count),
          averageDuration,
          averageCoins: `${roundNumber(averageCoinsValue)}${normalizedCoins[0]?.unit || ''}`,
          averageCells: `${roundNumber(averageCellsValue)}${normalizedCells[0]?.unit || ''}`,
          averageRerollShards: roundNumber(averageRerollShardsValue).toString(),
          averageCoinsPerHour: `${roundNumber(stats.totalCoinsPerHour / stats.count)}${normalizedCoins[0]?.unit || ''}`,
          averageCellsPerHour: `${roundNumber(stats.totalCellsPerHour / stats.count)}${normalizedCells[0]?.unit || ''}`,
          averageRerollShardsPerHour: `${roundNumber(stats.totalRerollShardsPerHour / stats.count)}${normalizedRerollShards[0]?.unit || ''}`,
          averageWavesPerHour: roundNumber(stats.totalWavesPerHour / stats.count),
          totalRuns: stats.count,
        }
      })
      .sort((a, b) => parseInt(b.tier) - parseInt(a.tier))
  })

  const appStyle = computed(() => ({
    fontFamily: fontFamily.value,
    fontSize: fontSize.value,
  }))

  const timelineChartData = computed(() => {
    const filteredRuns = itemsParsed.value.filter(run => visibleTiers.value[run.tier]).filter(run => selectedRunTypes.value.includes('all') || selectedRunTypes.value.includes(run.type ?? '')) as RunData[]
    const sortedRuns = [...filteredRuns].sort((a, b) => {
      if (sortByRunDateTime.value) {
        const dateA = new Date(`${a.runDate}T${a.runTime}`)
        const dateB = new Date(`${b.runDate}T${b.runTime}`)
        return dateA.getTime() - dateB.getTime()
      } else {
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        return dateA.getTime() - dateB.getTime()
      }
    })
    const labels = sortedRuns.map(run => `${run.date} ${run.time}`)
    const datasets: TimelineDataset[] = []
    const borderDash = (() => {
      switch (lineTypes.value.wave) {
        case 'dashed':
          return [5, 5]
        case 'dotted':
          return [1, 1]
        case 'long-dashed':
          return [10, 5]
        case 'short-dashed':
          return [3, 3]
        case 'dash-dot':
          return [5, 3, 1, 3]
        case 'dash-dot-dot':
          return [5, 3, 1, 3, 1, 3]
        case 'long-short-dash':
          return [10, 3, 3, 3]
        default:
          return []
      }
    })()

    if (groupByTierAverageTable.value) {
      const tierGroups = new Map<string, RunData[]>()
      sortedRuns.forEach(run => {
        if (!tierGroups.has(run.tier)) {
          tierGroups.set(run.tier, [])
        }
        tierGroups.get(run.tier)?.push(run)
      })

      const dateIndexMap = new Map<string, number>()
      labels.forEach((label, index) => {
        dateIndexMap.set(label, index)
      })

      tierGroups.forEach((runs, tier) => {
        const tierDataMap = new Map<string, number>()
        runs.forEach(run => {
          const dateKey = `${run.date} ${run.time}`
          tierDataMap.set(dateKey, parseInt(run.wave))
        })

        if (visibleTimelineColumns.value.wave) {
          const waveData = labels.map(label => tierDataMap.get(label) || null)
          datasets.push({
            label: `Wave (T${tier})`,
            data: waveData,
            borderColor: getTierColor(tier),
            backgroundColor: getTierColor(tier),
            pointRadius: dotSize.value,
            pointHoverRadius: dotSize.value + 2,
            borderDash,
            unit: '',
            tier: Array(labels.length).fill(tier),
            ordinal: Array(labels.length).fill(0),
            yAxisID: 'y',
          })
        }

        if (visibleTimelineColumns.value.coins) {
          const coinsData = labels.map(label => {
            const run = runs.find(r => `${r.date} ${r.time}` === label)
            return run ? parseValueWithUnit(run.coins).value : null
          })
          datasets.push({
            label: `Coins (T${tier})`,
            data: coinsData,
            borderColor: getTierColor(tier),
            backgroundColor: getTierColor(tier),
            pointRadius: dotSize.value,
            pointHoverRadius: dotSize.value + 2,
            borderDash,
            unit: runs[0] ? parseValueWithUnit(runs[0].coins).unit : '',
            tier: Array(labels.length).fill(tier),
            ordinal: Array(labels.length).fill(0),
            yAxisID: 'y1',
          })
        }

        if (visibleTimelineColumns.value.cells) {
          const cellsData = labels.map(label => {
            const run = runs.find(r => `${r.date} ${r.time}` === label)
            return run ? parseValueWithUnit(run.cells).value : null
          })
          datasets.push({
            label: `Cells (T${tier})`,
            data: cellsData,
            borderColor: getTierColor(tier),
            backgroundColor: getTierColor(tier),
            pointRadius: dotSize.value,
            pointHoverRadius: dotSize.value + 2,
            borderDash,
            unit: runs[0] ? parseValueWithUnit(runs[0].cells).unit : '',
            tier: Array(labels.length).fill(tier),
            ordinal: Array(labels.length).fill(0),
            yAxisID: 'y2',
          })
        }

        if (visibleTimelineColumns.value.rerollShards) {
          const rerollShardsData = labels.map(label => {
            const run = runs.find(r => `${r.date} ${r.time}` === label)
            return run ? parseValueWithUnit(run.rerollShards).value : null
          })
          datasets.push({
            label: `Reroll Shards (T${tier})`,
            data: rerollShardsData,
            borderColor: getTierColor(tier),
            backgroundColor: getTierColor(tier),
            pointRadius: dotSize.value,
            pointHoverRadius: dotSize.value + 2,
            borderDash,
            unit: runs[0] ? parseValueWithUnit(runs[0].rerollShards).unit : '',
            tier: Array(labels.length).fill(tier),
            ordinal: Array(labels.length).fill(0),
            yAxisID: 'y3',
          })
        }

        if (visibleTimelineColumns.value.coinsPerHour) {
          const coinsPerHourData = labels.map(label => {
            const run = runs.find(r => `${r.date} ${r.time}` === label)
            if (!run) return null
            const { value } = parseValueWithUnit(run.coins)
            const durationInHours = parseDuration(run.duration) / 3600
            return value / durationInHours
          })
          datasets.push({
            label: `Coins/Hour (T${tier})`,
            data: coinsPerHourData,
            borderColor: getTierColor(tier),
            backgroundColor: getTierColor(tier),
            pointRadius: dotSize.value,
            pointHoverRadius: dotSize.value + 2,
            borderDash,
            unit: runs[0] ? `${parseValueWithUnit(runs[0].coins).unit}/h` : '',
            tier: Array(labels.length).fill(tier),
            ordinal: Array(labels.length).fill(0),
            yAxisID: 'y4',
          })
        }

        if (visibleTimelineColumns.value.cellsPerHour) {
          const cellsPerHourData = labels.map(label => {
            const run = runs.find(r => `${r.date} ${r.time}` === label)
            if (!run) return null
            const { value } = parseValueWithUnit(run.cells)
            const durationInHours = parseDuration(run.duration) / 3600
            return value / durationInHours
          })
          datasets.push({
            label: `Cells/Hour (T${tier})`,
            data: cellsPerHourData,
            borderColor: getTierColor(tier),
            backgroundColor: getTierColor(tier),
            pointRadius: dotSize.value,
            pointHoverRadius: dotSize.value + 2,
            borderDash,
            unit: runs[0] ? `${parseValueWithUnit(runs[0].cells).unit}/h` : '',
            tier: Array(labels.length).fill(tier),
            ordinal: Array(labels.length).fill(0),
            yAxisID: 'y5',
          })
        }

        if (visibleTimelineColumns.value.rerollShardsPerHour) {
          const rerollShardsPerHourData = labels.map(label => {
            const run = runs.find(r => `${r.date} ${r.time}` === label)
            if (!run) return null
            const { value } = parseValueWithUnit(run.rerollShards)
            const durationInHours = parseDuration(run.duration) / 3600
            return value / durationInHours
          })
          datasets.push({
            label: `Reroll Shards/Hour (T${tier})`,
            data: rerollShardsPerHourData,
            borderColor: getTierColor(tier),
            backgroundColor: getTierColor(tier),
            pointRadius: dotSize.value,
            pointHoverRadius: dotSize.value + 2,
            borderDash,
            unit: runs[0] ? `${parseValueWithUnit(runs[0].rerollShards).unit}/h` : '',
            tier: Array(labels.length).fill(tier),
            ordinal: Array(labels.length).fill(0),
            yAxisID: 'y6',
          })
        }

        if (visibleTimelineColumns.value.wavesPerHour) {
          const wavesPerHourData = labels.map(label => {
            const run = runs.find(r => `${r.date} ${r.time}` === label)
            if (!run) return null
            const durationInHours = parseDuration(run.duration) / 3600
            return parseInt(run.wave) / durationInHours
          })
          datasets.push({
            label: `Waves/Hour (T${tier})`,
            data: wavesPerHourData,
            borderColor: getTierColor(tier),
            backgroundColor: getTierColor(tier),
            pointRadius: dotSize.value,
            pointHoverRadius: dotSize.value + 2,
            borderDash,
            unit: '/h',
            tier: Array(labels.length).fill(tier),
            ordinal: Array(labels.length).fill(0),
            yAxisID: 'y7',
          })
        }
      })
    } else {
      if (visibleTimelineColumns.value.wave) {
        datasets.push(createWaveDataset(sortedRuns, 'Wave'))
      }
      if (visibleTimelineColumns.value.coins) {
        datasets.push(createDataset(sortedRuns, 'coins', 'Coins', lineColors.value.coins))
      }
      if (visibleTimelineColumns.value.cells) {
        datasets.push(createDataset(sortedRuns, 'cells', 'Cells', lineColors.value.cells))
      }
      if (visibleTimelineColumns.value.rerollShards) {
        datasets.push(createDataset(sortedRuns, 'rerollShards', 'Reroll Shards', lineColors.value.rerollShards))
      }
      if (visibleTimelineColumns.value.coinsPerHour) {
        datasets.push(createDataset(sortedRuns, 'coinsPerHour', 'Coins', lineColors.value.coinsPerHour, true))
      }
      if (visibleTimelineColumns.value.cellsPerHour) {
        datasets.push(createDataset(sortedRuns, 'cellsPerHour', 'Cells', lineColors.value.cellsPerHour, true))
      }
      if (visibleTimelineColumns.value.rerollShardsPerHour) {
        datasets.push(createDataset(sortedRuns, 'rerollShardsPerHour', 'Reroll Shards', lineColors.value.rerollShardsPerHour, true))
      }
      if (visibleTimelineColumns.value.wavesPerHour) {
        datasets.push(createDataset(sortedRuns, 'wavesPerHour', 'Waves', lineColors.value.wavesPerHour, true))
      }
    }

    return { labels, datasets }
  })

  const timelineChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_event: ChartEvent, elements: { datasetIndex: number; index: number }[]) => {
      if (elements.length === 0) return
      const element = elements[0]
      const dataset = timelineChartData.value.datasets[element.datasetIndex] as TimelineDataset
      const index = element.index
      const ordinal = dataset.ordinal[index]
      const run = itemsParsed.value.find(r => r.ordinal === ordinal)
      if (run) {
        editRun(run)
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label (tooltipItem: TooltipItem<'line'>) {
            const dataset = tooltipItem.dataset as TimelineDataset
            const value = tooltipItem.parsed.y
            let label = dataset.label || ''
            let unit = dataset.unit

            if (label.includes('Hour')) {
              unit += '/h'
            }

            if (label) {
              label += ': '
            }
            if (value !== null) {
              label += value.toLocaleString() + unit
            }
            return label
          },
          afterLabel (tooltipItem: TooltipItem<'line'>) {
            const dataset = tooltipItem.dataset as TimelineDataset
            const index = tooltipItem.dataIndex
            return `Tier: ${dataset.tier[index]}\nRun #${dataset.ordinal[index]}`
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        type: 'linear' as const,
        display: visibleYAxes.value.wave,
        position: 'left' as const,
        title: {
          display: visibleYAxes.value.wave,
          text: 'Wave',
        },
      },
      y1: {
        type: 'linear' as const,
        display: visibleYAxes.value.coins,
        position: 'left' as const,
        title: {
          display: visibleYAxes.value.coins,
          text: 'Coins',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear' as const,
        display: visibleYAxes.value.cells,
        position: 'left' as const,
        title: {
          display: visibleYAxes.value.cells,
          text: 'Cells',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y3: {
        type: 'linear' as const,
        display: visibleYAxes.value.rerollShards,
        position: 'left' as const,
        title: {
          display: visibleYAxes.value.rerollShards,
          text: 'Reroll Shards',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y4: {
        type: 'linear' as const,
        display: visibleYAxes.value.coinsPerHour,
        position: 'left' as const,
        title: {
          display: visibleYAxes.value.coinsPerHour,
          text: 'Coins/Hour',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y5: {
        type: 'linear' as const,
        display: visibleYAxes.value.cellsPerHour,
        position: 'left' as const,
        title: {
          display: visibleYAxes.value.cellsPerHour,
          text: 'Cells/Hour',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y6: {
        type: 'linear' as const,
        display: visibleYAxes.value.rerollShardsPerHour,
        position: 'left' as const,
        title: {
          display: visibleYAxes.value.rerollShardsPerHour,
          text: 'Reroll Shards/Hour',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y7: {
        type: 'linear' as const,
        display: visibleYAxes.value.wavesPerHour,
        position: 'left' as const,
        title: {
          display: visibleYAxes.value.wavesPerHour,
          text: 'Waves/Hour',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }))

  const tableHeaders = computed(() => {
    return headers.filter(header => visibleColumns.value[header.key])
  })

  const visibleAverageHeaders = computed(() => {
    return averageHeaders.filter(header => visibleAverageColumns.value[header.key])
  })

  const itemsFiltered = computed(() => {
    if (selectedRunTypes.value.includes('all')) return itemsParsed.value
    return itemsParsed.value.filter(run => selectedRunTypes.value.includes(run.type ?? ''))
  })

  const groupBy = ref<SortItem[]>([])

  const selectedItems = ref<Set<string>>(new Set())

  const selectAll = computed({
    get: () => itemsFiltered.value.length > 0 && selectedItems.value.size === itemsFiltered.value.length,
    set: (value: boolean) => {
      if (value) {
        itemsFiltered.value.forEach(item => selectedItems.value.add(item.id))
      } else {
        selectedItems.value.clear()
      }
    },
  })
  // #endregion Computed properties

  // #region Functions
  const dateDisplayFormat = (date: Date) => {
    return dateAdapter.toISO(date)
  }

  const runsButtonStyle = (index: number) => {
    if (index === 3 && display.width.value < 595 && display.width.value >= 460 || index === 2 && display.width.value < 460) {
      return {
        borderRadius: '0px 4px 4px 0px',
      }
    }
    if (index === 0 && display.width.value < 595) {
      return {
        borderRadius: '4px 0px 0px 0px',
      }
    }
    if (index === 4 && display.width.value < 595) {
      return {
        borderRadius: '0px 0px 4px 0px',
      }
    }
    return {}
  }

  const getColorSchemeStyles = (scheme: string) => {
    const colors = {
      'midnight-purple': {
        primary: '#7c4dff',
        secondary: '#424242',
        accent: '#b388ff',
        error: '#ff5252',
        info: '#2196f3',
        success: '#4caf50',
        warning: '#ffc107',
      },
      'forest-green': {
        primary: '#2e7d32',
        secondary: '#424242',
        accent: '#69f0ae',
        error: '#ff5252',
        info: '#2196f3',
        success: '#4caf50',
        warning: '#ffc107',
      },
      'sunset': {
        primary: '#ff5722',
        secondary: '#424242',
        accent: '#ff9e80',
        error: '#ff5252',
        info: '#2196f3',
        success: '#4caf50',
        warning: '#ffc107',
      },
      'ocean': {
        primary: '#00bcd4',
        secondary: '#424242',
        accent: '#80deea',
        error: '#ff5252',
        info: '#2196f3',
        success: '#4caf50',
        warning: '#ffc107',
      },
      'default': {
        primary: '#1976d2',
        secondary: '#424242',
        accent: '#82b1ff',
        error: '#ff5252',
        info: '#2196f3',
        success: '#4caf50',
        warning: '#ffc107',
      },
    }

    const selectedColors = colors[scheme as keyof typeof colors] || colors.default

    Object.entries(selectedColors).forEach(([key, value]) => {
      theme.themes.value.light.colors[key as keyof typeof selectedColors] = value
      theme.themes.value.dark.colors[key as keyof typeof selectedColors] = value
    })
  }

  const fetchData = async () => {
    try {
      loading.value = true
      error.value = ''

      const runsCollection = await databases.listDocuments('run-tracker-data', `${authStore.uid}-runs`, [Query.limit(5000)])
      items.value = runsCollection.documents.map(doc => ({
        id: doc.$id,
        cells: doc.cells,
        rerollShards: doc.rerollShards,
        coins: doc.coins,
        date: doc.date,
        wave: doc.wave,
        duration: doc.duration,
        killedBy: doc.killedBy,
        tier: doc.tier,
        time: doc.time,
        type: doc.type,
        note: doc.note,
        runDate: doc.runDate,
        runTime: doc.runTime,
      }))
      loading.value = false

    } catch (err) {
      if (err && typeof err === 'object' && 'type' in err && err.type === 'collection_not_found') {
        console.error('Collection not found, initializing...')
        const account = new Account(client)
        const user = await account.createJWT()
        await axios.post(`${import.meta.env.VITE_API_URL}/user/init`, undefined, {
          headers: {
            'Authorization': user.jwt,
          },
        })
      } else {
        console.error('Error fetching data:', err)
        error.value = 'Failed to fetch data. Please try again later.'
      }
      loading.value = false
    }
  }

  const loadSettings = () => {
    try {
      const fontSettings = localStorage.getItem(STORAGE_KEYS.FONT)
      if (fontSettings) {
        const parsed = JSON.parse(fontSettings)
        fontFamily.value = parsed.fontFamily || 'Roboto'
        fontSize.value = parsed.fontSize || '14px'
        colorScheme.value = parsed.colorScheme || 'default'
        isDark.value = parsed.darkMode ?? true
        useMobileTableLayout.value = parsed.useMobileTableLayout ?? false
        showFullNotes.value = parsed.showFullNotes ?? false
        sortByRunDateTime.value = parsed.sortByRunDateTime ?? true
      }

      const columnSettings = localStorage.getItem(STORAGE_KEYS.COLUMNS)
      if (columnSettings) {
        const parsed = JSON.parse(columnSettings)
        visibleColumns.value = parsed.visibleColumns || defaultVisibleColumns
        visibleAverageColumns.value = parsed.visibleAverageColumns || defaultVisibleAverageColumns
        itemsPerPage.value = parsed.itemsPerPage || 10
        averageItemsPerPage.value = parsed.averageItemsPerPage || 10
      }

      const timelineSettings = localStorage.getItem(STORAGE_KEYS.TIMELINE)
      if (timelineSettings) {
        const parsed = JSON.parse(timelineSettings)
        visibleTimelineColumns.value = parsed.visibleTimelineColumns || defaultVisibleTimelineColumns
        groupByTierAverageTable.value = parsed.groupByTier ?? false
        showAllTiers.value = parsed.showAllTiers ?? true
        visibleTiers.value = parsed.visibleTiers || {}
        visibleYAxes.value = parsed.visibleYAxes || defaultYAxisVisibility
        dotSize.value = parsed.dotSize || 5
        lineTypes.value = parsed.lineTypes || {
          wave: 'solid',
          coins: 'solid',
          cells: 'solid',
          rerollShards: 'solid',
          coinsPerHour: 'solid',
          cellsPerHour: 'solid',
          rerollShardsPerHour: 'solid',
          wavesPerHour: 'solid',
        }
        lineColors.value = parsed.lineColors || {
          wave: '#1976d2',
          coins: '#4caf50',
          cells: '#ff9800',
          rerollShards: '#9c27b0',
          coinsPerHour: '#2196f3',
          cellsPerHour: '#ff5722',
          rerollShardsPerHour: '#607d8b',
          wavesPerHour: '#795548',
        }
      }

      const averageDatesSettings = localStorage.getItem(STORAGE_KEYS.AVERAGE_DATES)
      if (averageDatesSettings) {
        const parsed = JSON.parse(averageDatesSettings)
        averageFromDate.value = parsed.fromDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        // averageToDate.value = parsed.toDate || new Date().toISOString().split('T')[0]
      }

      const groupBySettings = localStorage.getItem(STORAGE_KEYS.GROUP_BY)
      if (groupBySettings) {
        const parsed = JSON.parse(groupBySettings)
        groupByTier.value = parsed.groupByTier ?? false
        groupByDate.value = parsed.groupByDate ?? false
        groupByType.value = parsed.groupByType ?? false
      }

      const selectedRunTypesSettings = localStorage.getItem(STORAGE_KEYS.SELECTED_RUN_TYPES)
      if (selectedRunTypesSettings) {
        const parsed = JSON.parse(selectedRunTypesSettings)
        dontChangeSelectedRunTypes = true
        selectedRunTypes.value = parsed.selectedRunTypes || runTypeOptions.map(option => option.value)
      }
    } catch (err) {
      console.error('Error loading settings:', err)

      fontFamily.value = 'Roboto'
      fontSize.value = '14px'
      colorScheme.value = 'default'
      isDark.value = true
      useMobileTableLayout.value = false
      visibleColumns.value = defaultVisibleColumns
      visibleAverageColumns.value = defaultVisibleAverageColumns
      itemsPerPage.value = 10
      averageItemsPerPage.value = 10
      visibleTimelineColumns.value = defaultVisibleTimelineColumns
      groupByTierAverageTable.value = false
      showAllTiers.value = true
      visibleTiers.value = {}
      visibleYAxes.value = defaultYAxisVisibility
      averageFromDate.value = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      averageToDate.value = new Date().toISOString().split('T')[0]
      groupByTier.value = false
      groupByDate.value = false
      groupByType.value = false
      selectedRunTypes.value = runTypeOptions.map(option => option.value)
      dotSize.value = 5
      lineTypes.value = {
        wave: 'solid',
        coins: 'solid',
        cells: 'solid',
        rerollShards: 'solid',
        coinsPerHour: 'solid',
        cellsPerHour: 'solid',
        rerollShardsPerHour: 'solid',
        wavesPerHour: 'solid',
      }
      lineColors.value = {
        wave: '#1976d2',
        coins: '#4caf50',
        cells: '#ff9800',
        rerollShards: '#9c27b0',
        coinsPerHour: '#2196f3',
        cellsPerHour: '#ff5722',
        rerollShardsPerHour: '#607d8b',
        wavesPerHour: '#795548',
      }
    }
  }

  const saveTimelineSettings = async () => {
    saveSettings(STORAGE_KEYS.TIMELINE, {
      visibleTimelineColumns: visibleTimelineColumns.value,
      groupByTier: groupByTierAverageTable.value,
      showAllTiers: showAllTiers.value,
      visibleTiers: visibleTiers.value,
      visibleYAxes: visibleYAxes.value,
      dotSize: dotSize.value,
      lineTypes: lineTypes.value,
      lineColors: lineColors.value,
    })
  }

  const toggleTheme = () => {
    try {
      theme.global.name.value = isDark.value ? 'dark' : 'light'
    } catch (err) {
      console.error('Error saving theme settings:', err)

      isDark.value = !isDark.value
      theme.global.name.value = isDark.value ? 'dark' : 'light'
    }
  }

  const processScreenshot = async (files: File[] | null) => {
    if (!files || files.length === 0) return

    processing.value = true

    screenshotQueue.value = Array.from(files)
    currentScreenshotIndex.value = 0

    try {
      await processNextScreenshot()
    } catch (err) {
      console.error('OCR Error:', err)
      notify({
        title: 'Error',
        text: 'Failed to process images. Please try again.',
        type: 'error',
      })
    } finally {
      processing.value = false
    }
  }

  const processNextScreenshot = async () => {
    if (currentScreenshotIndex.value >= screenshotQueue.value.length) {
      showOcrPreview.value = false
      screenshotQueue.value = []
      currentScreenshotIndex.value = 0
      return
    }

    const file = screenshotQueue.value[currentScreenshotIndex.value]
    screenshots.value = [file]

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ocr-website`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const lines = response.data.text as string[]
      const runDateTime = response.data.runDateTime
      const runData = parseOCRText(lines)
      if (!runData) {
        throw new Error('Could not extract run data from the image')
      }
      const dateTimeFromFile = new Date(file.lastModified);
      let runDateExtracted = runData.date
      let runTimeExtracted = runData.time
      if (runDateTime) {
        runDateExtracted = runDateTime.date
        runTimeExtracted = runDateTime.time
      } else if (dateTimeFromFile) {
        runDateExtracted = dateDisplayFormat(dateTimeFromFile)
        runTimeExtracted = dateTimeFromFile.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      }

      screenshotPreview.value = URL.createObjectURL(file)
      const date = shallowRef(dateAdapter.parseISO(runData.date) as Date)
      const runDate = shallowRef(dateAdapter.parseISO(runDateExtracted) as Date)
      ocrData.value = {
        ...runData,
        date,
        runDate,
        runTime: runTimeExtracted,
      }
      showOcrPreview.value = true
    } catch (err) {
      console.error('OCR Error:', err)
      notify({
        title: 'Error',
        text: 'Failed to process image, skipping...',
        type: 'error',
      })

      currentScreenshotIndex.value++
      if (currentScreenshotIndex.value < screenshotQueue.value.length) {
        await processNextScreenshot()
      } else {
        screenshots.value = null
      }
    }
  }

  const checkForDuplicate = (runData: { tier: string; wave: string; coins: string; cells: string; rerollShards: string }) => {
    return items.value.some(run => {
      const runCoins = run.coins.replace(',', '.')
      const runCells = run.cells.replace(',', '.')
      const runRerollShards = run.rerollShards.replace(',', '.')
      const newCoins = runData.coins.replace(',', '.')
      const newCells = runData.cells.replace(',', '.')
      const newRerollShards = runData.rerollShards.replace(',', '.')

      return run.tier === runData.tier &&
        run.wave === runData.wave &&
        runCoins === newCoins &&
        runCells === newCells &&
        runRerollShards === newRerollShards
    })
  }

  const saveOcrData = async () => {
    try {
      const runData = {
        ...ocrData.value,
        coins: normalizeNumericValue(ocrData.value.coins),
        cells: normalizeNumericValue(ocrData.value.cells),
        rerollShards: normalizeNumericValue(ocrData.value.rerollShards),
        type: ocrData.value.type || 'Farming',
      }

      if (checkForDuplicate(runData)) {
        if (!confirm('A run with the same tier, wave, coins, cells, and reroll shards already exists. Are you sure you want to add this run?')) {
          return
        }
      }

      await databases.createDocument('run-tracker-data', `${authStore.uid}-runs`, ID.unique(), {
        ...runData,
        date: dateDisplayFormat(runData.date),
        runDate: dateDisplayFormat(runData.runDate),
      })

      showSuccess('Run added')
      currentScreenshotIndex.value++
      await processNextScreenshot()
    } catch (err) {
      handleError(err as Error, 'saving OCR data')
    }
  }

  const skipCurrentScreenshot = async () => {
    currentScreenshotIndex.value++
    await processNextScreenshot()
  }

  const cancelOcrReview = () => {
    showOcrPreview.value = false
    screenshotQueue.value = []
    currentScreenshotIndex.value = 0
    screenshots.value = null
  }

  const parseOCRText = (lines: string[]) => {
    const tierMatch = lines.find(line => line.includes('Tier'))?.match(/\d+/)
    const waveMatch = lines.find(line => line.includes('Wave'))?.match(/\d+/)
    const durationMatch = lines.find(line => line.toLocaleLowerCase().replace(/\s+/gi, '').includes('realtime'))?.match(/(?:\d+h)?\s*(?:\d+m)?\s*(?:\d+s)/)
    const coinsMatch = lines.find(line => line.includes('Coins'))?.match(/\d+[,.]?\d*[a-zA-Z]?/)
    const cellsMatch = lines.find(line => line.includes('Cells'))?.match(/\d+[,.]?\d*[a-zA-Z]?/)
    const rerollShardsMatch = lines.find(line => line.toLocaleLowerCase().replace(/\s+/gi, '').includes('rerollshards'))?.match(/\d+[,.]?\d*[a-zA-Z]?/)
    const killedByMatch = lines.find(line => line.toLocaleLowerCase().replace(/\s+/gi, '').includes('killedby'))?.split(' ')[2]?.trim()

    if (!tierMatch || !waveMatch || !durationMatch || !coinsMatch || !cellsMatch || !rerollShardsMatch) {
      return null
    }

    return {
      tier: tierMatch[0],
      wave: waveMatch[0],
      duration: durationMatch[0].replace(/\s+/g, ''),
      coins: coinsMatch[0].replace(/8$/, 'B').replace(/9$/, 'q').replace(/g$/, 'q').replace(/7$/, 'T').replace(',', '.'),
      cells: cellsMatch[0].replace(',', '.'),
      rerollShards: rerollShardsMatch[0].replace(',', '.'),
      killedBy: (killedByMatch || 'Unknown').replace(/^[Ee]w$/, 'Ray'),
      date: new Date().toLocaleDateString('en-CA', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
      time: new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
      note: '',
      type: 'Farming',
    }
  }

  const truncateNote = (note?: string) => {
    return note && note.length > 10 ? note.substring(0, 10) + '...' : note
  }

  const toggleAllTiers = (value: boolean | null) => {
    if (value === null) return
    const newVisibleTiers: Record<string, boolean> = {}
    availableTiers.value.forEach(tier => {
      newVisibleTiers[tier] = value
    })
    visibleTiers.value = newVisibleTiers
    showAllTiers.value = value
  }

  const saveColumnSettings = () => {
    saveSettings(STORAGE_KEYS.COLUMNS, {
      visibleColumns: visibleColumns.value,
      visibleAverageColumns: visibleAverageColumns.value,
      itemsPerPage: itemsPerPage.value,
      averageItemsPerPage: averageItemsPerPage.value,
    })
  }

  const saveFontSettings = () => {
    saveSettings(STORAGE_KEYS.FONT, {
      fontFamily: fontFamily.value,
      fontSize: fontSize.value,
      colorScheme: colorScheme.value,
      darkMode: isDark.value,
      useMobileTableLayout: useMobileTableLayout.value,
      showFullNotes: showFullNotes.value,
      sortByRunDateTime: sortByRunDateTime.value,
    })
  }

  const editRun = (run: RunDatabase) => {
    const date = shallowRef(dateAdapter.parseISO(run.date) as Date)
    const runDate = shallowRef(dateAdapter.parseISO(run.runDate) as Date)
    editingRun.value = { ...run, date, runDate }
    showEditDialog.value = true
  }

  const updateRun = async () => {
    if (!editingRun.value) return

    try {
      await databases.updateDocument('run-tracker-data', `${authStore.uid}-runs`, editingRun.value.id, {
        tier: editingRun.value.tier,
        wave: editingRun.value.wave,
        duration: editingRun.value.duration,
        coins: normalizeNumericValue(editingRun.value.coins),
        cells: normalizeNumericValue(editingRun.value.cells),
        rerollShards: normalizeNumericValue(editingRun.value.rerollShards),
        killedBy: editingRun.value.killedBy,
        note: editingRun.value.note,
        date: dateDisplayFormat(editingRun.value.date),
        time: editingRun.value.time,
        runDate: dateDisplayFormat(editingRun.value.runDate),
        runTime: editingRun.value.runTime,
        type: editingRun.value.type || 'Farming',
      })

      showEditDialog.value = false
      editingRun.value = null
      await fetchData()
      showSuccess('Run updated')
    } catch (err) {
      handleError(err as Error, 'updating run')
    }
  }

  const cancelEdit = () => {
    showEditDialog.value = false
    editingRun.value = null
  }

  const deleteRun = async (runId: string) => {
    if (!confirm('Are you sure you want to delete this run?')) return

    try {
      const account = new Account(client)
      const user = await account.createJWT()
      await axios.delete(`${import.meta.env.VITE_API_URL}/user/run`, {
        headers: {
          'Authorization': user.jwt,
        },
        data: {
          runId,
        },
      })
      await fetchData()
      showSuccess('Run deleted')
    } catch (err) {
      handleError(err as Error, 'deleting run')
    }
  }

  const saveAverageDatesSettings = () => {
    saveSettings(STORAGE_KEYS.AVERAGE_DATES, {
      fromDate: averageFromDate.value,
    })
  }

  const addManualRun = async () => {
    try {
      const runData = {
        ...manualRun.value,
        coins: normalizeNumericValue(manualRun.value.coins),
        cells: normalizeNumericValue(manualRun.value.cells),
        rerollShards: normalizeNumericValue(manualRun.value.rerollShards),
        type: manualRun.value.type || 'Farming',
      }

      if (checkForDuplicate(runData)) {
        if (!confirm('A run with the same tier, wave, coins, cells, and reroll shards already exists. Are you sure you want to add this run?')) {
          return
        }
      }

      await databases.createDocument('run-tracker-data', `${authStore.uid}-runs`, ID.unique(), {
        ...runData,
        date: dateDisplayFormat(runData.date),
        runDate: dateDisplayFormat(runData.runDate),
      })

      manualRun.value = createDefaultRun()
      showSuccess('Run added')
      showManualEntry.value = false
      await fetchData()
    } catch (err) {
      handleError(err as Error, 'adding manual run')
    }
  }

  const handleItemsPerPageChange = (newValue: number) => {
    itemsPerPage.value = newValue
    saveColumnSettings()
  }

  const handleAverageItemsPerPageChange = (newValue: number) => {
    averageItemsPerPage.value = newValue
    saveColumnSettings()
  }

  const createDataset = (runs: RunData[], metric: MetricKey, label: string, color: string, isPerHour = false) => {
    const values = runs.map(run => parseValueWithUnit(run[metric]))
    const normalizedValues = normalizeUnits(values)
    const yAxisID = getYAxisID(metric, isPerHour)
    const borderDash = (() => {
      switch (lineTypes.value[metric]) {
        case 'dashed':
          return [5, 5]
        case 'dotted':
          return [1, 1]
        case 'long-dashed':
          return [10, 5]
        case 'short-dashed':
          return [3, 3]
        case 'dash-dot':
          return [5, 3, 1, 3]
        case 'dash-dot-dot':
          return [5, 3, 1, 3, 1, 3]
        case 'long-short-dash':
          return [10, 3, 3, 3]
        default:
          return []
      }
    })()
    return {
      label: isPerHour ? `${label}/Hour` : label,
      data: normalizedValues.map(({ value }) => value),
      borderColor: lineColors.value[metric],
      backgroundColor: lineColors.value[metric],
      pointRadius: dotSize.value,
      pointHoverRadius: dotSize.value + 2,
      borderDash,
      unit: normalizedValues[0]?.unit || '',
      tier: runs.map(run => run.tier),
      ordinal: runs.map(run => run.ordinal),
      yAxisID,
    }
  }

  const normalizeUnits = (values: { value: number; unit: string }[]) => {
    if (values.length === 0) return values

    // Count occurrences of each unit
    const unitCounts = new Map<string, number>()
    values.forEach(({ unit }) => {
      unitCounts.set(unit, (unitCounts.get(unit) || 0) + 1)
    })

    // Find the most prevalent unit
    let mostPrevalentUnit = ''
    let maxCount = 0
    unitCounts.forEach((count, unit) => {
      if (count > maxCount) {
        maxCount = count
        mostPrevalentUnit = unit
      }
    })

    // If no unit is found or all units are the same, return original values
    if (!mostPrevalentUnit || unitCounts.size === 1) return values

    // Convert all values to the most prevalent unit
    const unitMultipliers: Record<string, number> = {
      '': 1,
      'K': 1e3,
      'M': 1e6,
      'B': 1e9,
      'T': 1e12,
      'q': 1e15,
    }

    const targetMultiplier = unitMultipliers[mostPrevalentUnit] || 1

    return values.map(({ value, unit }) => {
      const sourceMultiplier = unitMultipliers[unit] || 1
      const normalizedValue = (value * sourceMultiplier) / targetMultiplier
      return { value: normalizedValue, unit: mostPrevalentUnit }
    })
  }

  const createWaveDataset = (runs: RunData[], label: string) => {
    const borderDash = (() => {
      switch (lineTypes.value.wave) {
        case 'dashed':
          return [5, 5]
        case 'dotted':
          return [1, 1]
        case 'long-dashed':
          return [10, 5]
        case 'short-dashed':
          return [3, 3]
        case 'dash-dot':
          return [5, 3, 1, 3]
        case 'dash-dot-dot':
          return [5, 3, 1, 3, 1, 3]
        case 'long-short-dash':
          return [10, 3, 3, 3]
        default:
          return []
      }
    })()
    return {
      label,
      data: runs.map(run => parseInt(run.wave)),
      borderColor: lineColors.value.wave,
      backgroundColor: lineColors.value.wave,
      pointRadius: dotSize.value,
      pointHoverRadius: dotSize.value + 2,
      borderDash,
      unit: '',
      tier: runs.map(run => run.tier),
      ordinal: runs.map(run => run.ordinal),
      yAxisID: 'y',
    }
  }

  const getYAxisID = (metric: MetricKey, isPerHour: boolean): string => {
    switch (metric) {
      case 'wave':
        return 'y'
      case 'coins':
        return isPerHour ? 'y4' : 'y1'
      case 'cells':
        return isPerHour ? 'y5' : 'y2'
      case 'rerollShards':
        return isPerHour ? 'y6' : 'y3'
      case 'wavesPerHour':
        return 'y7'
      case 'coinsPerHour':
        return 'y4'
      case 'cellsPerHour':
        return 'y5'
      case 'rerollShardsPerHour':
        return 'y6'
      default:
        return 'y'
    }
  }

  const getTierColor = (tier: string) => tierColors[parseInt(tier) % tierColors.length]

  const getYAxisLabel = (key: string): string => {
    const labels: Record<string, string> = {
      wave: 'Wave',
      coins: 'Coins',
      cells: 'Cells',
      rerollShards: 'Reroll Shards',
      coinsPerHour: 'Coins/Hour',
      cellsPerHour: 'Cells/Hour',
      rerollShardsPerHour: 'Reroll Shards/Hour',
      wavesPerHour: 'Waves/Hour',
    }
    return labels[key] || key
  }

  const logout = async () => {
    try {
      loading.value = true
      await authStore.logout()
    } catch (err) {
      console.error('Error logging out:', err)
      notify({
        title: 'Error',
        text: 'Failed to logout. Please try again.',
        type: 'error',
      })
    } finally {
      loading.value = false
    }
  }

  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items
    if (!items) return

    const files: File[] = []
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) files.push(file)
      }
    }

    if (files.length > 0) {
      screenshots.value = files
      await processScreenshot(files)
    }
  }

  const deleteSelectedRuns = async () => {
    const count = selectedItems.value.size
    if (!confirm(`Are you sure you want to delete ${count} selected runs?`)) return

    try {
      const account = new Account(client)
      const user = await account.createJWT()
      await Promise.all(Array.from(selectedItems.value).map(runId =>
        axios.delete(`${import.meta.env.VITE_API_URL}/user/run`, {
          headers: {
            'Authorization': user.jwt,
          },
          data: {
            runId,
          },
        })
      ))
      selectedItems.value.clear()
      await fetchData()
      showSuccess(`${count} runs deleted`)
    } catch (err) {
      handleError(err as Error, 'deleting selected runs')
    }
  }
  // #endregion Functions

  // #region Mounted
  onMounted(async () => {
    document.addEventListener('paste', handlePaste)
    watch(() => authStore.isAuthenticated, async isAuthenticated => {
      if (isAuthenticated) {
        try {
          loadSettings()
          getColorSchemeStyles(colorScheme.value)
          theme.global.name.value = isDark.value ? 'dark' : 'light'
          await fetchData()
        } catch (err) {
          console.error('Error fetching data:', err)
          error.value = 'Failed to fetch data. Please try again later.'
          loading.value = false
        }
      }
    }, { immediate: true })
  })
  // #endregion Mounted

  // #region Unmounted
  onUnmounted(() => {
    document.removeEventListener('paste', handlePaste)
  })
  // #endregion Unmounted

  // #region Watchers
  watch(availableTiers, newTiers => {
    const newVisibleTiers: Record<string, boolean> = {}
    newTiers.forEach(tier => {
      newVisibleTiers[tier] = visibleTiers.value[tier] ?? showAllTiers.value
    })
    visibleTiers.value = newVisibleTiers
  }, { immediate: true })

  watch(groupByTier, newValue => {
    if (newValue) {
      groupBy.value.push({ key: 'tier', order: 'asc' })
    } else {
      groupBy.value = groupBy.value.filter(item => item.key !== 'tier')
    }
  })

  watch(groupByDate, newValue => {
    if (newValue) {
      groupBy.value.push({ key: 'date', order: 'asc' })
    } else {
      groupBy.value = groupBy.value.filter(item => item.key !== 'date')
    }
  })

  watch(groupByType, newValue => {
    if (newValue) {
      groupBy.value.push({ key: 'type', order: 'asc' })
    } else {
      groupBy.value = groupBy.value.filter(item => item.key !== 'type')
    }
  })

  watch(selectedRunTypes, (newValue, oldValue) => {
    if (dontChangeSelectedRunTypes) {
      dontChangeSelectedRunTypes = false
      return
    }
    const [swichtedOnRunType] = newValue.filter(type => !oldValue.includes(type))
    const [swichtedOffRunType] = oldValue.filter(type => !newValue.includes(type))

    if (swichtedOnRunType === 'all') {
      selectedRunTypes.value.push(...runTypeOptions.filter(option => option.value !== 'all').map(option => option.value).filter(type => !newValue.includes(type)))
    } else if (swichtedOffRunType === 'all') {
      selectedRunTypes.value = []
    } else if (swichtedOnRunType) {
      if (!selectedRunTypes.value.includes('all') && runTypeOptions.filter(option => option.value !== 'all').map(option => option.value).every(type => newValue.includes(type))) {
        selectedRunTypes.value.push('all')
      }
    } else if (swichtedOffRunType && selectedRunTypes.value.includes('all')) {
      selectedRunTypes.value = selectedRunTypes.value.filter(type => type !== 'all')
      dontChangeSelectedRunTypes = true
    }
  }, { deep: true })

  watch(visibleTiers, newVisibleTiers => {
    const allTiersVisible = Object.values(newVisibleTiers).every(visible => visible)
    if (allTiersVisible && !showAllTiers.value) {
      showAllTiers.value = true
    } else if (!allTiersVisible && showAllTiers.value) {
      showAllTiers.value = false
    }
  }, { deep: true })

  watch(showManualEntry, newValue => {
    if (!newValue) {
      manualRun.value.date = new Date()
      manualRun.value.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
  })

  watch([groupByTierAverageTable, showAllTiers, visibleTiers, dotSize, lineTypes], () => {
    saveTimelineSettings()
  }, { deep: true })

  watch([visibleColumns, visibleAverageColumns, itemsPerPage, averageItemsPerPage], () => {
    saveColumnSettings()
  }, { deep: true })

  watch([fontFamily, fontSize, colorScheme, isDark, useMobileTableLayout, showFullNotes, sortByRunDateTime], () => {
    saveFontSettings()
  })

  watch(colorScheme, newScheme => {
    getColorSchemeStyles(newScheme)
  })

  watch([averageFromDate/* , averageToDate */], () => {
    saveAverageDatesSettings()
  })

  watch(visibleTimelineColumns, newColumns => {
    if (areVisibleTimelineColumnsDefault) {
      areVisibleTimelineColumnsDefault = false
      return
    }
    const timelineSettings = localStorage.getItem(STORAGE_KEYS.TIMELINE)
    let oldColumns: Record<string, boolean> = {}
    if (timelineSettings) {
      const parsed = JSON.parse(timelineSettings)
      oldColumns = parsed.visibleTimelineColumns
    }

    const newShownColumns = Object.entries(newColumns).filter(([, value]) => value).filter(([key]) => !oldColumns[key])
    const newHiddenColumns = Object.entries(oldColumns).filter(([, value]) => value).filter(([key]) => !newColumns[key])

    const newYAxes = { ...visibleYAxes.value }
    newShownColumns.forEach(([key]) => {
      newYAxes[key as keyof YAxisVisibility] = true
    })
    newHiddenColumns.forEach(([key]) => {
      newYAxes[key as keyof YAxisVisibility] = false
    })
    visibleYAxes.value = newYAxes

    saveTimelineSettings()
  }, { deep: true })

  watch(visibleYAxes, newYAxes => {
    if (areVisibleYAxesDefault) {
      areVisibleYAxesDefault = false
      return
    }
    const timelineSettings = localStorage.getItem(STORAGE_KEYS.TIMELINE)
    let oldYAxes: Record<string, boolean> = {}
    if (timelineSettings) {
      const parsed = JSON.parse(timelineSettings)
      oldYAxes = parsed.visibleYAxes
    }
    const newShownYAxes = Object.entries(newYAxes).filter(([, value]) => value).filter(([key]) => !oldYAxes[key])
    const timelineColumnsToShow = newShownYAxes.filter(([key]) => !visibleTimelineColumns.value[key as keyof TimelineColumnVisibility])
    timelineColumnsToShow.forEach(([key]) => {
      visibleTimelineColumns.value[key as keyof TimelineColumnVisibility] = true
    })
    saveTimelineSettings()
  }, { deep: true })

  watch(showOcrPreview, async newValue => {
    if (!newValue) {
      await fetchData()
      screenshots.value = null
    }
  })

  watch([groupByTier, groupByDate, groupByType], () => {
    saveSettings(STORAGE_KEYS.GROUP_BY, {
      groupByTier: groupByTier.value,
      groupByDate: groupByDate.value,
      groupByType: groupByType.value,
    })
  })

  watch(selectedRunTypes, newValue => {
    saveSettings(STORAGE_KEYS.SELECTED_RUN_TYPES, {
      selectedRunTypes: newValue,
    })
  }, { deep: true })
  // #endregion Watchers
</script>

<style scoped>
.preview-image {
  max-width: 100%;
  height: auto;
  display: block;
  max-height: 500px;
  object-fit: contain;
  cursor: pointer;
}

.large-preview-image {
  max-width: 100%;
  height: auto;
  display: block;
  cursor: pointer;
}

:deep(.image-preview-dialog .v-overlay__content) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  max-height: 80vh;
}

:deep(.image-preview-dialog .v-overlay__scrim) {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

:deep(.image-preview-dialog .v-card) {
  background: transparent !important;
  box-shadow: none !important;
}

:deep(.v-data-table),
:deep(.v-data-table-header),
:deep(.v-data-table__tr),
:deep(.v-data-table__td),
:deep(.v-data-table__th),
:deep(.v-card),
:deep(.v-card-title),
:deep(.v-card-text),
:deep(.v-text-field),
:deep(.v-text-field input),
:deep(.v-text-field label),
:deep(.v-btn),
:deep(.v-menu),
:deep(.v-list),
:deep(.v-list-item),
:deep(.v-checkbox),
:deep(.v-checkbox label),
:deep(.v-select),
:deep(.v-select input),
:deep(.v-select label),
:deep(.v-dialog),
:deep(.v-dialog__content),
:deep(.v-dialog__container),
:deep(.v-dialog__body),
:deep(.v-dialog__title),
:deep(.v-dialog__text),
:deep(.v-form),
:deep(.v-form input),
:deep(.v-form label),
:deep(.v-alert),
:deep(.v-alert__content),
:deep(.v-alert__title),
:deep(.v-alert__text),
:deep(.v-progress-linear),
:deep(.v-progress-linear__content),
:deep(.v-progress-linear__determinate),
:deep(.v-progress-linear__indeterminate),
:deep(.v-progress-linear__background),
:deep(.v-progress-linear__buffer),
:deep(.v-progress-linear__stream),
:deep(.v-progress-linear__determinate),
:deep(.v-progress-linear__indeterminate),
:deep(.v-progress-linear__background),
:deep(.v-progress-linear__buffer),
:deep(.v-progress-linear__stream) {
  font-family: v-bind('fontFamily') !important;
  font-size: v-bind('fontSize') !important;
}
</style>