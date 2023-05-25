

class ToLowMaxZIndexException(Exception):
    """MAX_Z_INDEX_ON_DESKTOP lower oe equal than MAX_WIDGETS_ON_DESKTOP"""

    def __init__(
            self,
            message="MAX_Z_INDEX_ON_DESKTOP "
                    "lower oe equal than "
                    "MAX_WIDGETS_ON_DESKTOP"
    ):
        self.message = message
        super().__init__(self.message)
